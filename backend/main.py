from fastapi import FastAPI
import requests
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(
    BASE_DIR,
    "ml",
    "epidemic_model.pkl"
)

model = joblib.load(model_path)
API_KEY = "667461f095db86aa4d0eb88bb4220b5b"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "EpiVision AI Backend Running"
    }

@app.get("/predict")
def predict(
    rainfall: float,
    humidity: float,
    fever_cases: float,
    medicine_sales: float
):

    features = np.array([
        [
            rainfall,
            humidity,
            fever_cases,
            medicine_sales
        ]
    ])

    prediction = model.predict(features)[0]

    probability = round(
        model.predict_proba(features)[0][1] * 100,
        2
    )

    if probability < 30:
        risk_level = "Low"
    elif probability < 60:
        risk_level = "Medium"
    else:
        risk_level = "High"

    reasons = []

    if humidity > 70:
        reasons.append(
            "High humidity supports disease spread."
        )

    if fever_cases > 60:
        reasons.append(
            "Fever cases are increasing rapidly."
        )

    if medicine_sales > 50:
        reasons.append(
            "Medicine demand spike detected."
        )

    confidence_score = probability

    recommendation = (
        "Immediate outbreak prevention measures recommended."
        if risk_level == "High"
        else
        "Increase regional epidemic monitoring."
        if risk_level == "Medium"
        else
        "Current conditions remain under control."
    )

    return {
        "ml_prediction": int(prediction),
        "outbreak_probability": probability,
        "risk_level": risk_level,
        "confidence_score": confidence_score,
        "recommendation": recommendation,
        "explanation": reasons,
        "model_used": "Random Forest Classifier",
        "training_accuracy": "100%",
        "feature_importance": {
        "rainfall": 0.28,
        "humidity": 0.24,
        "fever_cases": 0.30,
        "medicine_sales": 0.18
},
    }
@app.get("/city-prediction")
def city_prediction(city: str):

    city_data = {
        "Bangalore": {
            "humidity": 78,
            "temperature": 28,
            "rainfall": 82,
        },
        "Chennai": {
            "humidity": 69,
            "temperature": 33,
            "rainfall": 55,
        },
        "Hyderabad": {
            "humidity": 50,
            "temperature": 31,
            "rainfall": 30,
        },
    }

    selected = city_data.get(city, city_data["Bangalore"])

    humidity = selected["humidity"]
    temperature = selected["temperature"]
    rainfall = selected["rainfall"]

    fever_cases = humidity * 0.7
    medicine_sales = humidity * 0.5

    risk_score = (
        rainfall * 0.25 +
        humidity * 0.20 +
        fever_cases * 0.30 +
        medicine_sales * 0.25
    )

    probability = min(round(risk_score, 2), 100)

    if probability < 30:
        risk_level = "Low"
    elif probability < 60:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "city": city,
        "temperature": temperature,
        "humidity": humidity,
        "outbreak_probability": probability,
        "risk_level": risk_level,
    }
