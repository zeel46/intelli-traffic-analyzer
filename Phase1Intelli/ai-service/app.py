from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))

# Load models safely
def load_model(filename):
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            return pickle.load(f)
    print(f"Warning: {filename} not found!")
    return None

anomaly_model = load_model('anomaly_model.pkl')
classification_model = load_model('classification_model.pkl')
forecast_model = load_model('forecast_model.pkl')

@app.route('/predict-anomaly', methods=['POST'])
def predict_anomaly():
    if not anomaly_model:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json
    try:
        # Expected features: ['requests_per_minute', 'repeated_page_ratio', 'same_ip_hits', 'session_duration']
        features = pd.DataFrame([{
            'requests_per_minute': data.get('requests_per_minute', 0),
            'repeated_page_ratio': data.get('repeated_page_ratio', 0.0),
            'same_ip_hits': data.get('same_ip_hits', 1),
            'session_duration': data.get('session_duration', 60)
        }])
        
        prediction = anomaly_model.predict(features)
        
        # Isolation Forest returns -1 for anomaly, 1 for normal
        result = "anomaly" if prediction[0] == -1 else "normal"
        return jsonify({"result": result})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict-user-type', methods=['POST'])
def predict_user_type():
    if not classification_model:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json
    try:
        # Expected features: ['requests_per_minute', 'unique_pages', 'avg_time_gap', 'repeated_page_ratio', 'same_ip_hits']
        features = pd.DataFrame([{
            'requests_per_minute': data.get('requests_per_minute', 10),
            'unique_pages': data.get('unique_pages', 2),
            'avg_time_gap': data.get('avg_time_gap', 10.0),
            'repeated_page_ratio': data.get('repeated_page_ratio', 0.1),
            'same_ip_hits': data.get('same_ip_hits', 1)
        }])
        
        prediction = classification_model.predict(features)
        
        return jsonify({"result": prediction[0]})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict-traffic', methods=['POST'])
def predict_traffic():
    if not forecast_model:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json
    try:
        # Expect current hour index or we just guess next hour
        current_hour = data.get('current_hour_index', 100)
        
        prediction = forecast_model.predict(np.array([[current_hour]]))
        
        return jsonify({
            "predicted_visitors": max(0, int(prediction[0]))
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
