import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os
import json
import sys

# Define the same model architecture
def getModel():
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dropout, Flatten, Dense

    model = Sequential()
    model.add(Conv2D(100, kernel_size=(5, 5), activation='relu', input_shape=(100, 100, 1)))
    model.add(Dropout(0.1))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    
    model.add(Conv2D(50, kernel_size=(3, 3), activation='relu'))
    model.add(Dropout(0.1))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    
    model.add(Conv2D(50, kernel_size=(3, 3), activation='relu'))
    model.add(Dropout(0.1))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    
    model.add(Flatten())
    model.add(Dense(100, activation='relu'))
    model.add(Dropout(0.1))
    model.add(Dense(50, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Prediction function
def predict_image(img_path, model):
    print(f"Debug: Opening image at {img_path}", file=sys.stderr)
    img = image.load_img(img_path, target_size=(100, 100), color_mode="grayscale")
    img_array = image.img_to_array(img)
    print(f"Debug: Image shape after loading: {img_array.shape}", file=sys.stderr)
    
    img_array = np.expand_dims(img_array, axis=0)  # Convert to 4D
    print(f"Debug: Image shape after expanding: {img_array.shape}", file=sys.stderr)
    
    img_array /= 255.0
    print(f"Debug: Pixel value range: {np.min(img_array)} to {np.max(img_array)}", file=sys.stderr)

    predictions = model.predict(img_array)
    print(f"Debug: Raw prediction values: {predictions}", file=sys.stderr)
    
    predicted_class = np.argmax(predictions)
    print(f"Debug: Predicted class index: {predicted_class}", file=sys.stderr)
    
    classes = ['Pneumonia', 'Normal']  # Make sure this order matches your training
    return classes[predicted_class]

if __name__ == "__main__":
    try:
        # Get the directory where model.py is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, "imageClassificationModel.h5")
        
        # Print debug info to stderr instead of stdout
        print(f"Debug: Looking for model at {model_path}", file=sys.stderr)
        
        # Load model with absolute path
        model = load_model(model_path)
        
        print("Debug: Model loaded successfully", file=sys.stderr)
        
        # Process the image path from command line
        image_path = sys.argv[1]
        print(f"Debug: Processing image at {image_path}", file=sys.stderr)
        
        result = predict_image(image_path, model)
        print(f"Debug: Prediction result: {result}", file=sys.stderr)
        
        # Return ONLY the JSON formatted result to stdout
        print(json.dumps({"prediction": result}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))