import pandas as pd
import numpy as np
import random
import os

def generate_traffic_data(num_samples=1500):
    data = []
    
    for _ in range(num_samples):
        # Determine traffic type
        traffic_type = random.choices(['normal', 'bot', 'suspicious'], weights=[0.7, 0.2, 0.1])[0]
        
        if traffic_type == 'normal':
            requests_per_minute = random.randint(5, 20)
            unique_pages = random.randint(3, 15)
            avg_time_gap = random.uniform(5.0, 30.0)
            repeated_page_ratio = random.uniform(0.0, 0.3)
            same_ip_hits = random.randint(1, 20)
            session_duration = random.randint(60, 600)
            
        elif traffic_type == 'bot':
            requests_per_minute = random.randint(50, 200)
            unique_pages = random.randint(1, 3)
            avg_time_gap = random.uniform(0.1, 1.0)
            repeated_page_ratio = random.uniform(0.8, 1.0)
            same_ip_hits = random.randint(100, 500)
            session_duration = random.randint(10, 120)
            
        else: # suspicious
            requests_per_minute = random.randint(20, 50)
            unique_pages = random.randint(1, 5)
            avg_time_gap = random.uniform(1.0, 5.0)
            repeated_page_ratio = random.uniform(0.5, 0.8)
            same_ip_hits = random.randint(20, 100)
            session_duration = random.randint(30, 300)
            
        data.append({
            'requests_per_minute': requests_per_minute,
            'unique_pages': unique_pages,
            'avg_time_gap': avg_time_gap,
            'repeated_page_ratio': repeated_page_ratio,
            'same_ip_hits': same_ip_hits,
            'session_duration': session_duration,
            'label': traffic_type
        })
        
    df = pd.DataFrame(data)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    
    csv_path = os.path.join(os.path.dirname(__file__), 'traffic_dataset.csv')
    df.to_csv(csv_path, index=False)
    print(f"✅ Generated {num_samples} rows of synthetic traffic data at {csv_path}")

if __name__ == "__main__":
    generate_traffic_data()
