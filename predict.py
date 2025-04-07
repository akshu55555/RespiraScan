# predict.py
import os
import sys
import json
import numpy as np
import tensorflow as tf
from keras.preprocessing import image

# Suppress TensorFlow logs and warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

# Check if image path is passed
if len(sys.argv) < 2:
    print(json.dumps({"error": "No image path provided."}))
    sys.exit(1)

image_path = sys.argv[1]

# Load model
try:
    model = tf.keras.models.load_model("new_accuracy_kaggle.h5")
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {str(e)}"}))
    sys.exit(1)

# Load and preprocess image
try:
    img = image.load_img(image_path, target_size=(64, 64), color_mode='grayscale')
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
except Exception as e:
    print(json.dumps({"error": f"Error processing image: {str(e)}"}))
    sys.exit(1)

# Predict
try:
    prediction = model.predict(img_array, verbose=0)
    predicted_class = 1 if prediction[0][0] > 0.5 else 0
    confidence = float(prediction[0][0]) if predicted_class == 1 else float(1 - prediction[0][0])
    labels = {0: 'Normal', 1: 'Pneumonia'}
    result = {"label": labels[predicted_class], "confidence": round(confidence, 4)}
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()

except Exception as e:
    print(json.dumps({"error": f"Error during prediction: {str(e)}"}))
    sys.exit(1)
