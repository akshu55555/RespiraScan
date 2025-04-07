# predict.py
import tensorflow as tf
from keras.preprocessing import image
import numpy as np
import sys
import json

# Get image path from command line
if len(sys.argv) < 2:
    print(json.dumps({"error": "No image path provided."}))
    sys.exit(1)

image_path = sys.argv[1]

# Load model
try:
    model = tf.keras.models.load_model("new_accuracy_kaggle.h5")
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {e}"}))
    sys.exit(1)

# Load and preprocess image
try:
    img = image.load_img(image_path, target_size=(64, 64), color_mode='grayscale')
except Exception as e:
    print(json.dumps({"error": f"Error loading image: {e}"}))
    sys.exit(1)

img = image.img_to_array(img)
img = np.expand_dims(img, axis=0)
img /= 255.0

# Predict
result = model.predict(img)
predicted_class = 1 if result[0][0] > 0.5 else 0
confidence = float(result[0][0]) if predicted_class == 1 else float(1 - result[0][0])

# Labels
labels = {0: 'Normal', 1: 'Pneumonia'}

# Output as JSON
print(json.dumps({"label": labels[predicted_class], "confidence": confidence}))