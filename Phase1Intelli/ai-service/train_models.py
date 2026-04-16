import pandas as pd
import pickle
import os
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
try:
    from statsmodels.tsa.arima.model import ARIMA
except ImportError:
    pass # we'll use a simpler heuristic for the demo if statsmodels is missing

def train_and_save_models():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'traffic_dataset.csv')
    
    if not os.path.exists(csv_path):
        print("Dataset not found. Please run generate_dataset.py first.")
        return
        
    df = pd.parse_csv(csv_path) if hasattr(pd, 'parse_csv') else pd.read_csv(csv_path)
    
    # Features for Anomaly Detection (Isolation Forest)
    anomaly_features = ['requests_per_minute', 'repeated_page_ratio', 'same_ip_hits', 'session_duration']
    X_anomaly = df[anomaly_features]
    
    print("Training Anomaly Detection Model (Isolation Forest)...")
    iso_forest = IsolationForest(contamination=0.1, random_state=42)
    iso_forest.fit(X_anomaly)
    
    with open(os.path.join(base_dir, 'anomaly_model.pkl'), 'wb') as f:
        pickle.dump(iso_forest, f)
        
    # Features for Classification (Random Forest)
    classification_features = ['requests_per_minute', 'unique_pages', 'avg_time_gap', 'repeated_page_ratio', 'same_ip_hits']
    X_class = df[classification_features]
    y_class = df['label']
    
    print("Training Classification Model (Random Forest)...")
    X_train, X_test, y_train, y_test = train_test_split(X_class, y_class, test_size=0.2, random_state=42)
    
    rf_classifier = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_classifier.fit(X_train, y_train)
    
    # Evaluate
    y_pred = rf_classifier.predict(X_test)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    with open(os.path.join(base_dir, 'classification_model.pkl'), 'wb') as f:
        pickle.dump(rf_classifier, f)
        
    # Dummy Forecast Model (Linear Regression for simplicity)
    print("Training Forecast Model (Linear Regression)...")
    from sklearn.linear_model import LinearRegression
    import numpy as np
    
    # Synthetic time-series data: Hours 1 to 24 mapping to visit traffic
    X_time = np.arange(1, 100).reshape(-1, 1)
    y_traffic = 50 + X_time.flatten() * 2 + np.random.normal(0, 10, 99)
    
    lr_forecast = LinearRegression()
    lr_forecast.fit(X_time, y_traffic)
    
    with open(os.path.join(base_dir, 'forecast_model.pkl'), 'wb') as f:
        pickle.dump(lr_forecast, f)

    print("✅ All models trained and saved successfully.")

if __name__ == "__main__":
    train_and_save_models()
