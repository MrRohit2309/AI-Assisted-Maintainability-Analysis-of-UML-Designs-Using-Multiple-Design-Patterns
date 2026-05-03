from flask import Flask, request, jsonify
import joblib
import cv2
import pytesseract
import numpy as np   

app = Flask(__name__)

# load trained AI model
model = joblib.load("model.pkl")


# Home route (optional)
@app.route("/")
def home():
    return "UML AI Model is running"


@app.route("/predict", methods=["POST"])
def predict():

    # check if image exists
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # convert uploaded image to OpenCV format
    image = cv2.imdecode(
        np.frombuffer(file.read(), np.uint8),
        cv2.IMREAD_COLOR
    )

    # OCR text detection
    text = pytesseract.image_to_string(image)

    print("Detected Text From UML:")
    print(text)

    # simple UML feature estimation
    classes = text.lower().count("class")
    relations = text.count("--")
    inheritance = text.count("<|--")

    dependencies = relations
    methods = text.count("()")
    attributes = text.count(":")

    # feature vector
    features = [[
        classes,
        relations,
        inheritance,
        dependencies,
        methods,
        attributes
    ]]

    # AI prediction
    prediction = model.predict(features)[0]

    return jsonify({
        "coupling": float(prediction[0]),
        "cohesion": float(prediction[1]),
        "modularity": float(prediction[2]),
        "extensibility": float(prediction[3]),
        "complexity": float(prediction[4])
    })


# run AI server
app.run(port=5050)