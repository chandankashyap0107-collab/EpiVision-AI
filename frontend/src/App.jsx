import { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,


}

  from "recharts";

function App() {
  const [prediction, setPrediction] = useState(null);
  const [rainfall, setRainfall] = useState(80);
  const [humidity, setHumidity] = useState(72);
  const [feverCases, setFeverCases] = useState(65);
  const [medicineSales, setMedicineSales] = useState(50);
  const [city, setCity] = useState("Bangalore");
  const riskColor =
    prediction?.risk_level === "High"
      ? "bg-red-600"
      : prediction?.risk_level === "Medium"
        ? "bg-yellow-500"
        : "bg-green-600";

  const riskText =
    prediction?.risk_level === "High"
      ? "Critical outbreak indicators detected."
      : prediction?.risk_level === "Medium"
        ? "Potential outbreak conditions emerging."
        : "Current outbreak indicators stable.";
  const outbreakZones = [
    {
      city: city,
      position:
        city === "Bangalore"
          ? [12.9716, 77.5946]
          : city === "Chennai"
            ? [13.0827, 80.2707]
            : [17.3850, 78.4867],

      risk: prediction?.risk_level || "Low",

      cases: prediction?.outbreak_probability || 20,
    },
  ];
  const forecastData = [
    { day: "Mon", cases: 20 },
    { day: "Tue", cases: 35 },
    { day: "Wed", cases: 50 },
    { day: "Thu", cases: 70 },
    { day: "Fri", cases: 90 },
    { day: "Sat", cases: 120 },
  ];

  useEffect(() => {

    axios
      .get(
        `http://127.0.0.1:8000/city-prediction?city=${city}`
      )
      .then((res) => {

        const humidityData = res.data.humidity;

        setRainfall(res.data.outbreak_probability);

        setHumidity(humidityData);

        setFeverCases(
          Math.round(humidityData * 0.7)
        );

        setMedicineSales(
          Math.round(humidityData * 0.5)
        );
      });

  }, [city]);



  useEffect(() => {

    axios
      .get(
        `http://127.0.0.1:8000/predict?rainfall=${rainfall}&humidity=${humidity}&fever_cases=${feverCases}&medicine_sales=${medicineSales}`
      )

      .then((res) => {
        setPrediction(res.data);
      });

  }, [
    rainfall,
    humidity,
    feverCases,
    medicineSales,
  ]);


  [
    rainfall,
    humidity,
    feverCases,
    medicineSales,
    city,
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Emergency Alert Banner */}

      <div
        className={`${prediction?.risk_level === "High"
          ? "bg-red-600"
          : prediction?.risk_level === "Medium"
            ? "bg-yellow-500"
            : "bg-green-600"
          } text-white p-4 rounded-2xl mb-6 flex items-center justify-between shadow-lg`}
      >

        <div>
          <h2 className="text-xl font-bold">
            Epidemic Alert System Active
          </h2>

          <p className="text-sm text-red-100">
            {riskText}
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">
            {prediction?.risk_level || "Analyzing"}
          </p>
        </div>

      </div>
      <h1 className="text-4xl font-bold mb-2 text-center">
        EpiVision AI
      </h1>

      <p className="text-center text-gray-400 mb-10">
        Predicting Epidemics Before They Happen
      </p>
      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Live Surveillance Region
        </h2>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-slate-800 text-white p-3 rounded-xl w-full"
        >
          <option>Bangalore</option>
          <option>Chennai</option>
          <option>Hyderabad</option>
        </select>

      </div>
      {/* Control Panel */}

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">

        <h2 className="text-2xl font-semibold mb-6">
          Epidemic Simulation Controls
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label>Rainfall</label>
            <input
              type="range"
              min="0"
              max="100"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="w-full"
            />
            <p>{rainfall}</p>
          </div>

          <div>
            <label>Humidity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full"
            />
            <p>{humidity}</p>
          </div>

          <div>
            <label>Fever Cases</label>
            <input
              type="range"
              min="0"
              max="100"
              value={feverCases}
              onChange={(e) => setFeverCases(e.target.value)}
              className="w-full"
            />
            <p>{feverCases}</p>
          </div>

          <div>
            <label>Medicine Sales</label>
            <input
              type="range"
              min="0"
              max="100"
              value={medicineSales}
              onChange={(e) => setMedicineSales(e.target.value)}
              className="w-full"
            />
            <p>{medicineSales}</p>
          </div>

        </div>

      </div>
      {/* Real-Time Data Pipeline */}

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">

        <h2 className="text-2xl font-semibold mb-6 text-green-400">
          Real-Time Epidemiological Data Streams
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-slate-800 p-4 rounded-xl border border-cyan-500">
            <h3 className="font-bold mb-2">
              Weather Surveillance
            </h3>

            <p className="text-sm text-gray-400">
              Humidity, rainfall, temperature tracking
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-yellow-500">
            <h3 className="font-bold mb-2">
              Fever Trend Analysis
            </h3>

            <p className="text-sm text-gray-400">
              Regional symptom escalation monitoring
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-red-500">
            <h3 className="font-bold mb-2">
              Pharmacy Intelligence
            </h3>

            <p className="text-sm text-gray-400">
              Medicine demand spike detection
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-green-500">
            <h3 className="font-bold mb-2">
              Geospatial Risk Engine
            </h3>

            <p className="text-sm text-gray-400">
              AI outbreak clustering & hotspot analysis
            </p>
          </div>

        </div>

      </div>
      {/* ML Analytics Engine */}

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8 border border-purple-500">

        <h2 className="text-2xl font-semibold mb-6 text-purple-400">
          Machine Learning Analytics Engine
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-slate-800 p-5 rounded-xl">

            <p className="text-gray-400 mb-2">
              ML Model
            </p>

            <h3 className="text-2xl font-bold text-white">
              {prediction?.model_used}
            </h3>

          </div>

          <div className="bg-slate-800 p-5 rounded-xl">

            <p className="text-gray-400 mb-2">
              Training Accuracy
            </p>

            <h3 className="text-2xl font-bold text-green-400">
              {prediction?.training_accuracy}
            </h3>

          </div>

        </div>

        <div className="mt-6 bg-slate-800 p-5 rounded-xl">

          <h3 className="text-xl font-semibold mb-4">
            Feature Importance Analysis
          </h3>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between mb-1">
                <span>Fever Cases</span>
                <span>30%</span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Rainfall</span>
                <span>28%</span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: "28%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Humidity</span>
                <span>24%</span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-cyan-500 h-3 rounded-full"
                  style={{ width: "24%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Medicine Sales</span>
                <span>18%</span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-yellow-500 h-3 rounded-full"
                  style={{ width: "18%" }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>
      {/* Bayesian Intelligence Engine */}

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8 border border-cyan-500">

        <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
          Bayesian Epidemic Intelligence Engine
        </h2>

        <p className="text-gray-300 mb-6">
          The AI continuously updates outbreak probability
          using probabilistic evidence analysis.
        </p>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">
              Rainfall Evidence
            </p>

            <h3 className="text-2xl font-bold text-blue-400">
              {rainfall}%
            </h3>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">
              Humidity Evidence
            </p>

            <h3 className="text-2xl font-bold text-cyan-400">
              {humidity}%
            </h3>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">
              Fever Trend Signal
            </p>

            <h3 className="text-2xl font-bold text-yellow-400">
              {feverCases}
            </h3>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-sm text-gray-400">
              Medicine Spike Index
            </p>

            <h3 className="text-2xl font-bold text-red-400">
              {medicineSales}
            </h3>
          </div>

        </div>

        <div className="mt-6 bg-slate-800 p-5 rounded-xl">

          <h3 className="text-lg font-semibold mb-2">
            Bayesian Probability Update
            P(Outbreak|Evidence) = (P(Evidence|Outbreak) × P(Outbreak)) / P(Evidence)
          </h3>
          <div className="bg-slate-950 border border-cyan-500 p-4 rounded-xl mb-4 text-center">

            <p className="text-cyan-400 text-lg font-bold">
              P(Outbreak | Evidence)
            </p>

            <p className="text-gray-300 mt-2">
              =
            </p>

            <p className="text-yellow-400 text-lg font-semibold mt-2">
              (P(Evidence | Outbreak) × P(Outbreak))
            </p>

            <p className="text-gray-300 mt-2">
              ÷
            </p>

            <p className="text-red-400 text-lg font-semibold mt-2">
              P(Evidence)
            </p>

          </div>

          <p className="text-gray-300 leading-7">
            <div className="space-y-4">

              <div className="flex justify-between bg-slate-700 p-3 rounded-lg">
                <span>Prior Outbreak Probability</span>
                <span className="font-bold text-yellow-400">
                  35%
                </span>
              </div>

              <div className="flex justify-between bg-slate-700 p-3 rounded-lg">
                <span>Environmental Evidence Confidence</span>
                <span className="font-bold text-cyan-400">
                  {prediction?.confidence_score || 72}%
                </span>
              </div>

              <div className="flex justify-between bg-slate-700 p-3 rounded-lg">
                <span>Posterior Bayesian Risk</span>
                <span className="font-bold text-red-400">
                  {prediction?.outbreak_probability || 0}%
                </span>
              </div>

            </div>
          </p>

        </div>

      </div>
      {/* Risk Card */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-500" />
          <h2 className="text-2xl font-semibold">
            Outbreak Risk Analysis
          </h2>
        </div>

        {prediction && (
          <>
            <p className="text-5xl font-bold text-red-400 mb-4">
              {prediction.outbreak_probability}%
            </p>

            <p className="text-xl mb-6">
              Risk Level:
              <span className="ml-2 font-bold text-yellow-400">
                {prediction.risk_level}
              </span>
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                AI Explanation
              </h3>

              <ul className="space-y-2">
                {prediction.explanation.map((item, index) => (
                  <li
                    key={index}
                    className="bg-slate-800 p-3 rounded-lg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid md:grid-cols-2 gap-4">

                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    AI Confidence Score
                  </p>

                  <h3 className="text-3xl font-bold text-cyan-400">
                    {prediction.confidence_score}%
                  </h3>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm">
                    AI Recommendation
                  </p>

                  <h3 className="text-lg font-semibold text-green-400">
                    {prediction.recommendation}
                  </h3>
                </div>

              </div>
            </div>
          </>
        )}
      </div>
      {/* Risk Zones */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-red-900/40 border border-red-500 p-5 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Bangalore Urban</h3>
          <p className="text-red-400 text-3xl font-bold mb-2">82%</p>
          <p className="text-gray-300">
            High mosquito breeding conditions detected.
          </p>
        </div>

        <div className="bg-yellow-900/40 border border-yellow-500 p-5 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Chennai</h3>
          <p className="text-yellow-400 text-3xl font-bold mb-2">61%</p>
          <p className="text-gray-300">
            Fever case trends rising rapidly.
          </p>
        </div>

        <div className="bg-green-900/40 border border-green-500 p-5 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Hyderabad</h3>
          <p className="text-green-400 text-3xl font-bold mb-2">29%</p>
          <p className="text-gray-300">
            Currently stable outbreak indicators.
          </p>
        </div>

      </div>
      {/* Epidemic Heat Map */}

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-8">

        <h2 className="text-2xl font-semibold mb-6">
          Live Epidemic Risk Map
        </h2>

        <div className="h-[400px] rounded-xl overflow-hidden">

          <MapContainer
            center={[15.3173, 75.7139]}
            zoom={5}
            scrollWheelZoom={false}
            className="h-full w-full"
          >

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {outbreakZones.map((zone, index) => (
              <CircleMarker
                key={index}
                center={zone.position}
                radius={20}
                pathOptions={{
                  color:
                    zone.risk === "High"
                      ? "red"
                      : zone.risk === "Medium"
                        ? "yellow"
                        : "green",
                }}
              >
                <Popup>
                  <div>
                    <h3>{zone.city}</h3>
                    <p>Risk: {zone.risk}</p>
                    <p>Predicted Cases: {zone.cases}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}

          </MapContainer>

        </div>

      </div>
      {/* Forecast Chart */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">
          7-Day Outbreak Forecast
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={forecastData}>
              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="cases"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;