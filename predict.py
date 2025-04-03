# predict.py
import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Load the model    
model = tf.keras.models.load_model("updated_model.h5")


def predict_image(image_path):
   img=image.load_img(image_path)
   img_array=image.img_to_array(img)
   img_array=np.expand_dims(img_array,axis=0)

   prediction = model.predict(img_array)
   class_idx=int(np.argmax(prediction))
   result = {"prediction": class_idx, "confidence": float(prediction[0][class_idx])}
   print(result)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
    else:
        image_path = sys.argv[1]
        predict_image(image_path)
