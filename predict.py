# predict.py
import os
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Suppress TensorFlow logs and warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress most TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN custom operations
tf.get_logger().setLevel('ERROR')

def log_to_stderr(message):
    """Helper function to log messages to stderr"""
    print(json.dumps(message), file=sys.stderr)

def main():
    try:
        # Check if image path is passed
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No image path provided."}))
            sys.exit(1)
        
        image_path = sys.argv[1]
        
        # Ensure the image exists
        if not os.path.exists(image_path):
            print(json.dumps({"error": f"Image file not found: {image_path}"}))
            sys.exit(1)
        
        # Load model
        log_to_stderr({"status": "Loading model..."})
        model = tf.keras.models.load_model("new_accuracy_kaggle.h5")
        log_to_stderr({"status": "Model loaded successfully"})
        
        # Load and preprocess image
        log_to_stderr({"status": "Processing image..."})
        img = image.load_img(image_path, target_size=(64, 64), color_mode='grayscale')
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        log_to_stderr({"status": "Image processed successfully"})
        
        # Predict
        log_to_stderr({"status": "Running prediction..."})
        prediction = model.predict(img_array, verbose=0)
        predicted_class = 1 if prediction[0][0] > 0.5 else 0
        confidence = float(prediction[0][0]) if predicted_class == 1 else float(1 - prediction[0][0])
        labels = {0: 'Normal', 1: 'Pneumonia'}
        
        # Create result object
        result = {
            "label": labels[predicted_class], 
            "confidence": round(confidence, 4)
        }
        
        # IMPORTANT: Only print the result JSON to stdout, nothing else
        print(json.dumps(result))
        
        # Logging completion to stderr
        log_to_stderr({"status": "Prediction complete"})
        
    except Exception as e:
        error_msg = f"Error during execution: {str(e)}"
        log_to_stderr({"error": error_msg})
        print(json.dumps({"error": error_msg}))
        sys.exit(1)

if __name__ == "__main__":
    main()