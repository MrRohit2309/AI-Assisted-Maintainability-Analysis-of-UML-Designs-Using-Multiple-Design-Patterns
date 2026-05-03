import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# load dataset
data = pd.read_csv("uml_dataset.csv")

# input features
X = data[[
"classes",
"relations",
"inheritance",
"dependencies",
"methods",
"attributes"
]]

# target outputs
y = data[[
"coupling",
"cohesion",
"modularity",
"extensibility",
"complexity"
]]

# train model
model = RandomForestRegressor()
model.fit(X, y)

# save model
joblib.dump(model, "model.pkl")

print("AI Model Trained Successfully")