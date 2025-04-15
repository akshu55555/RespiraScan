import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input
import cv2
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import sys
import os
import json
from pathlib import Path

import tensorflow as tf
from tensorflow.keras.layers import Input

def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
    """
    Creates a Grad-CAM heatmap for the specified prediction index.

    Args:
        img_array: Input image as a numpy array (with batch dimension)
        model: Pre-trained model to use
        last_conv_layer_name: Name of the last convolutional layer in the model
        pred_index: Index of the class to generate heatmap for (default: highest scoring class)

    Returns:
        The generated heatmap as a numpy array
    """
    # Define the input tensor with the model's input shape and name
    input_tensor = Input(shape=model.input_shape[1:], name='input_layer_6')

    # Create a model that outputs only the last convolutional layer's output
    x = input_tensor
    for layer in model.layers:
        if layer.name == last_conv_layer_name:
            last_conv_layer_output = layer(x)
            break
        x = layer(x)
    conv_model = Model(inputs=input_tensor, outputs=last_conv_layer_output)

    # Compute the gradient of the target class with respect to the output feature map
    with tf.GradientTape() as tape:
        # Cast image to float32 for gradient tracking
        img_array = tf.cast(img_array, tf.float32)
        tape.watch(img_array)

        # Get the output of the last conv layer using the conv_model
        conv_output = conv_model(img_array)

        # Get the model's prediction using the original model
        predictions = model(img_array)

        if pred_index is None:
            pred_index = tf.argmax(predictions[0])

        # Extract just the prediction score for the class we want to focus on
        class_channel = predictions[:, pred_index]

    # Compute the gradient of the class output value with respect to the feature map
    grads = tape.gradient(class_channel, conv_output)

    # This is a vector where each entry is the mean intensity of the gradient
    # over a specific feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # We multiply each channel in the feature map by "how important this channel is"
    # with regard to the top predicted class then sum all the channels
    conv_output = conv_output[0]
    heatmap = conv_output @ pooled_grads[..., tf.newaxis]

    # Normalize the heatmap between 0 & 1
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()
def preprocess_image(img_path, target_size=(64, 64)):
    """
    Load and preprocess an image to be used with a model.

    Args:
        img_path: Path to the image file
        target_size: Size to resize the image to

    Returns:
        Preprocessed image array with batch dimension
    """
    # Load image and resize as grayscale
    img = image.load_img(img_path, target_size=target_size, color_mode="grayscale")

    # Convert to array and add channel dimension
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # adds batch dimension
    return img_array

def display_gradcam(img_path, heatmap, alpha=0.4, save_paths=None):
    """
    Display Grad-CAM heatmap overlaid on the original image with adjusted RGB colors

    Args:
        img_path: Path to the original image
        heatmap: Generated Grad-CAM heatmap (values between 0 and 1)
        alpha: Transparency factor for the heatmap overlay
        save_paths: Dictionary with paths to save the visualization (optional)
    """
    # Load and prepare original image
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not read image from {img_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Resize heatmap to image size and scale
    heatmap_resized = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap_uint8 = np.uint8(255 * heatmap_resized)

    # Apply JET colormap
    jet_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    jet_heatmap = cv2.cvtColor(jet_heatmap, cv2.COLOR_BGR2RGB)

    # Lighten blue and green channels
    r, g, b = cv2.split(jet_heatmap)
    g = np.clip(g * 0.4 + 150, 0, 255).astype(np.uint8)  # Light green
    b = np.clip(b * 0.4 + 150, 0, 255).astype(np.uint8)  # Light blue
    modified_heatmap = cv2.merge([r, g, b])

    # Blend with original image
    superimposed_img = cv2.addWeighted(img, 1 - alpha, modified_heatmap, alpha, 0)

    # If save paths are provided, save the images
    if save_paths:
        # Save original
        if 'original' in save_paths:
            cv2.imwrite(save_paths['original'], cv2.cvtColor(img, cv2.COLOR_RGB2BGR))

        # Save heatmap
        if 'heatmap' in save_paths:
            cv2.imwrite(save_paths['heatmap'], cv2.cvtColor(modified_heatmap, cv2.COLOR_RGB2BGR))

        # Save superimposed
        if 'overlay' in save_paths:
            cv2.imwrite(save_paths['overlay'], cv2.cvtColor(superimposed_img, cv2.COLOR_RGB2BGR))

    return superimposed_img

def apply_gradcam(model, img_path, last_conv_layer_name, save_paths=None, target_size=(224, 224), preprocess_func=None, pred_index=None):
    """
    Apply Grad-CAM to an image and save the results.

    Args:
        model: Pre-trained model to use
        img_path: Path to the image file
        last_conv_layer_name: Name of the last convolutional layer
        save_paths: Dictionary with paths to save the visualization
        target_size: Size to resize the image to
        preprocess_func: Optional preprocessing function
        pred_index: Index of class to visualize (default: highest scoring class)

    Returns:
        Dictionary with heatmap, class index, and confidence
    """
    # Get the image array
    img_array = preprocess_image(img_path, target_size)

    # Apply model-specific preprocessing if provided
    processed_img_array = img_array  # Assuming no specific preprocessing needed beyond resizing

    # --- MAKE A PREDICTION WITH THE ORIGINAL MODEL ---
    preds = model.predict(processed_img_array)

    # Get class index if not specified
    if pred_index is None:
        pred_index = np.argmax(preds[0])
        print(f"Visualizing class index: {pred_index}")

    # --- TRY TO GET LAST CONV LAYER OUTPUT DIRECTLY ---
    last_conv_layer_model = tf.keras.models.Model(model.inputs, model.get_layer(last_conv_layer_name).output)
    last_conv_output = last_conv_layer_model.predict(processed_img_array)
    print(f"Shape of last_conv_output in apply_gradcam: {last_conv_output.shape}")

    # Generate Grad-CAM heatmap
    heatmap = make_gradcam_heatmap(processed_img_array, model, last_conv_layer_name, pred_index)

    # Display and save the heatmap
    superimposed = display_gradcam(img_path, heatmap, save_paths=save_paths)

    return {
        'heatmap': heatmap,
        'class_index': int(pred_index),
        'confidence': float(preds[0][pred_index])
    }

def main():
    # Check if correct number of arguments provided
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing image path"}))
        sys.exit(1)

    img_path = sys.argv[1]

    # Create output directory for visualizations
    output_dir = Path("visualizations")
    output_dir.mkdir(exist_ok=True)

    # Create paths for output images
    base_filename = Path(img_path).stem
    output_paths = {
        'original': str(output_dir / f"{base_filename}_original.jpg"),
        'heatmap': str(output_dir / f"{base_filename}_heatmap.jpg"),
        'overlay': str(output_dir / f"{base_filename}_overlay.jpg")
    }

    # --- IMPORTANT CHANGES HERE ---
    # 1. Define the path to your .h5 weights file
    weights_file_path = 'new_accuracy_kaggle.h5'  # <--- Assuming it's in the same directory

    # 2. Load your trained model from the .h5 file
    try:
        model = load_model(weights_file_path)
        print(f"Model loaded successfully from: {weights_file_path}")
        model.summary() # Print the model summary to identify the last conv layer
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
        sys.exit(1)

    # 3. DEFINE THE NAME OF THE LAST CONVOLUTIONAL LAYER IN YOUR MODEL
    #    Inspect the output of model.summary() and replace 'your_last_conv_layer_name'
    #    with the actual name of the last Conv2D layer.
    last_conv_layer_name = 'conv2d_11'  # <--- **VERY IMPORTANT: UPDATE THIS BASED ON YOUR MODEL SUMMARY**

    try:
        # Apply Grad-CAM
        result = apply_gradcam(
            model=model,
            img_path=img_path,
            last_conv_layer_name=last_conv_layer_name,
            save_paths=output_paths,
            target_size=(64, 64) # Ensure this matches the input size of your model
            # If your model requires specific preprocessing (like normalization), add it here.
            # Example for basic normalization:
            # preprocess_func=lambda x: x / 255.0
        )

        # Determine the label based on the prediction (adjust as needed for your classes)
        labels = ['Normal', 'Pneumonia']  # Assuming your model predicts these two classes
        predicted_class_index = result['class_index']
        predicted_label = labels[predicted_class_index] if predicted_class_index < len(labels) else 'Unknown'

        # Create response with prediction and visualization paths
        response = {
            'label': predicted_label,
            'confidence': result['confidence'],
            'visualizations': {
                'original': output_paths['original'],
                'heatmap': output_paths['heatmap'],
                'overlay': output_paths['overlay']
            }
        }

        # Print JSON response to be captured by Node.js
        print(json.dumps(response))

    except Exception as e:
        print(json.dumps({"error": f"Visualization failed: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()