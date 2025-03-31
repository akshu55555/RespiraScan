from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Load your trained model
MODEL_PATH = "model.ipynb"  # Change this to your model's filename
model = tf.keras.models.load_model(MODEL_PATH)

# Preprocessing function
def preprocess_image(image):
    image = image.resize((224, 224))  # Resize to match model input size
    image = np.array(image) / 255.0   # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

# API Route to handle image uploads
@app.route("/upload", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    image = Image.open(io.BytesIO(file.read()))
    
    # Preprocess and predict
    processed_image = preprocess_image(image)
    prediction = model.predict(processed_image)
    
    # Convert prediction to readable format
    result = "Pneumonia" if prediction[0][0] > 0.5 else "Normal"
    
    return jsonify({"prediction": result})

if __name__ == "__main__":
    app.run(debug=True)
