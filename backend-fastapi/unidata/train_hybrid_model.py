import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import os
import re

def clean_value(val):
    if pd.isna(val) or val == '':
        return np.nan
    if isinstance(val, str):
        # Remove '_tbr' and other non-numeric chars except '.'
        cleaned = re.sub(r'[^0-9.]', '', val)
        return float(cleaned) if cleaned else np.nan
    return float(val)

def train_tabular_model():
    print("Loading data...")
    meta_path = os.path.join(os.path.dirname(__file__), 'for notebook', 'Unidata__Body_Measure  META.csv')
    df = pd.read_csv(meta_path, sep='\t')
    
    # Target columns (upper body relevant)
    targets = [
        'shoulder_width_cm', 
        'chest_circumference_cm', 
        'arm_length_cm', 
        'waist_circumference_cm',
        'neck_circumference_cm'
    ]
    
    # Feature columns
    features = ['height', 'weight', 'age', 'gender']
    
    # Clean targets
    for col in targets:
        df[col] = df[col].apply(clean_value)
    
    # Clean features
    df['height'] = df['height'].apply(clean_value)
    df['weight'] = df['weight'].apply(clean_value)
    df['age'] = df['age'].apply(clean_value)
    
    # Drop rows with missing features or too many missing targets
    df = df.dropna(subset=features)
    df = df.dropna(subset=targets, thresh=3) # Keep if at least 3 targets are present
    
    # Fill remaining NaNs in targets with mean
    for col in targets:
        df[col] = df[col].fillna(df[col].mean())
        
    print(f"Cleaned dataset size: {len(df)}")
    
    # Encoding
    le = LabelEncoder()
    df['gender_encoded'] = le.fit_transform(df['gender'])
    
    X = df[['height', 'weight', 'age', 'gender_encoded']]
    y = df[targets]
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Model
    print("Training MultiOutput Random Forest...")
    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    model = MultiOutputRegressor(rf)
    model.fit(X_train_scaled, y_train)
    
    # Evaluation
    score = model.score(X_test_scaled, y_test)
    print(f"Model R^2 Score: {score:.4f}")
    
    # Save artifacts
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model, os.path.join(models_dir, 'body_measure_model.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'body_scaler.pkl'))
    joblib.dump(le, os.path.join(models_dir, 'gender_encoder.pkl'))
    joblib.dump(targets, os.path.join(models_dir, 'target_columns.pkl'))
    
    print(f"Models saved to {models_dir}")

if __name__ == "__main__":
    train_tabular_model()
