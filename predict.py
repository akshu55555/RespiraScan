# predict.py
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Load the model
model = tf.keras.models.load_model("model.h5")

def predict_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))  # Adjust size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0  # Normalize

    prediction = model.predict(img_array)
    class_idx = int(np.argmax(prediction))
    
    result = {"prediction": class_idx, "confidence": float(prediction[0][class_idx])}
    print(json.dumps(result))  # Output JSON

if __name__ == "__main__":
    image_path = sys.argv[1]  # Get image path from CLI
    predict_image(image_path)