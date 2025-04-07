#!/usr/bin/env python
# coding: utf-8

# In[1]:


import numpy as np 
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import Flatten,BatchNormalization
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.layers import Convolution2D,Conv2D
from tensorflow.keras.layers import MaxPooling2D
from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession
from tensorflow.keras import optimizers


# In[2]:


tf.__version__


# In[3]:


# Root folder of the dataset
# Dataset URL-> https://www.kaggle.com/paultimothymooney/chest-xray-pneumonia
datasetFolderName='chest_xray'
# Model file name for saving
MODEL_FILENAME="imageClassificationModel.keras"
# Input image dimensions
img_rows, img_cols, numOfChannels =  100, 100, 1   #images are resized to 100 by 100, and they are black and white, hence 1 numofchannels
# Train, Validation, and Test data path
train_path = r"D:\Mrinmayi\SE\PBL\kaggle_archive\DS2\chest_xray\train"
validation_path = r"D:\Mrinmayi\SE\PBL\kaggle_archive\DS2\chest_xray\val"
test_path = r"D:\Mrinmayi\SE\PBL\kaggle_archive\DS2\chest_xray\test"


# In[4]:


def showResults(test, pred):
    target_names = ['positive', 'negative']
    # print(classification_report(test, pred, target_names=target_names))
    accuracy = accuracy_score(test, pred)
    precision=precision_score(test, pred, average='weighted')
    f1Score=f1_score(test, pred, average='weighted') 
    print("Accuracy  : {}".format(accuracy))
    print("Precision : {}".format(precision))
    print("f1Score : {}".format(f1Score))
    cm=confusion_matrix(test, pred)
    print(cm)    


# In[5]:


# Data Augmentation
train_datagen = ImageDataGenerator(
                rescale=1./255,  # feature scaling
                # validation_split=0.1,
                # shear_range=0.05,
            	# horizontal_flip=True,
        		# rotation_range=30,
        		# zoom_range=0.20,
                # zca_whitening=True,
            	fill_mode="nearest"    # fill nearest  pixel to nearest pixel value
                )
validation_datagen = ImageDataGenerator(
                rescale=1./255,
                # shear_range=0.05,
            	# horizontal_flip=True,
        		# rotation_range=30,
        		# zoom_range=0.20,
                # zca_whitening=True,
            	fill_mode="nearest"
                )

# keep the test images intact, hence not using the same augmentation here as we did on the training set
# but rescale their pixels
test_datagen = ImageDataGenerator(rescale=1./255)

activationFunction='relu'  #Allows only important information to pass 
batch_size = 32  # default value   
epoch= 30   # how many times model goes thru entire dataset

# inporting the dataset from our directory
train_generator = train_datagen.flow_from_directory(  # calls all methods from class
        train_path,
        target_size=(img_rows, img_cols), # final size of images when fed
        batch_size=batch_size,
        class_mode='categorical',
        color_mode="grayscale")

validation_generator = train_datagen.flow_from_directory(
        validation_path,
        target_size=(img_rows, img_cols),
        batch_size=batch_size,
        class_mode='categorical',
        color_mode="grayscale")

test_generator = test_datagen.flow_from_directory(
        test_path,
        target_size=(img_rows, img_cols),
        batch_size=batch_size,
        color_mode="grayscale",
        class_mode=None,  # only data, no labels
        shuffle=False)


# In[23]:


print(train_datagen.class_indices)


# In[6]:


def getModel():
    model = Sequential()
    #tf.keras.models.Sequential()---> introduces as sequence of layers 

    
    model.add(Conv2D(100, kernel_size = (5, 5), activation=activationFunction, input_shape=(img_rows, img_cols, numOfChannels)))
    # Conv2d(filters-->no of feature detectors, kernels--->no of rows and columns per detector
    model.add(Dropout(0.1))   # drops 10% of nuerons randomly to prevent overfitting
    model.add(MaxPooling2D(pool_size=(2,2)))   ## pool_size is the size of the frame from the feature map out of which we select the maximum value
    # do this thrice to add 3 convolution layers
    
    model.add(Conv2D(50, kernel_size=(3,3), activation=activationFunction))
    model.add(Dropout(0.1))
    model.add(MaxPooling2D(pool_size=(2,2)))
    
    model.add(Conv2D(50, kernel_size=(3,3), activation=activationFunction))
    model.add(Dropout(0.1))
    model.add(MaxPooling2D(pool_size=(2,2)))
    
    model.add(Flatten())
    model.add(Dense(100, activation=activationFunction))  # full connection--> no of hidden nuerons, relu till output layer is reached
    model.add(Dropout(0.1))
    model.add(Dense(50, activation=activationFunction))
    model.add(Dense(2, activation = 'softmax'))    # output layer--> no of neurons = 2, as chance of both outcomes, hence softmax
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])  # compiling
    
    return model

model = getModel()


# In[7]:


# save best model
checkpoint = ModelCheckpoint(MODEL_FILENAME,  # model filename
                             monitor='loss',
                             verbose=1, # verbosity - 0 or 1
                             save_best_only=True, 
                             mode='auto') 

# stop training if loss doesnt improve after 5 consecutive epochs
early_stopping = EarlyStopping(monitor='loss',
                               
                               verbose=1,
                               mode='auto')
# fit model
history = model.fit(train_generator,    
                    epochs=epoch,
                    validation_data=validation_generator, 
                    callbacks=[checkpoint, early_stopping])


# In[8]:


# Plot validation accuracy and loss
history.history['loss']
fig=plt.rc('figure', figsize=(7, 5))

fontLabels = {'family': 'Times New Roman',
        'color':  'black',
        'weight': 'bold',
        'size': 24,
        }

axisLabelFont=18
#Validation Accuracy Plot   
plt.xticks([1,10,20], fontsize=axisLabelFont)
plt.yticks(fontsize=axisLabelFont)
plt.ylim(ymin=0.7,ymax=1.1) 
plt.xlim(xmin=1, xmax=20)
plt.plot(history.history['accuracy'])
plt.title('Accuracy curve', fontdict=fontLabels)
plt.ylabel('Accuracy', fontdict=fontLabels)
plt.xlabel('Epohcs', fontdict=fontLabels)
plt.legend(['Train'], loc='upper center', frameon=False, bbox_to_anchor=(0.50, 1.03), shadow=False, ncol=2, fontsize=axisLabelFont)
plt.show()

#Validation Loss Plot   
plt.xticks([1,10,20],fontsize=axisLabelFont)
plt.yticks(fontsize=axisLabelFont)
plt.ylim(ymin=0,ymax=0.5) 
plt.xlim(xmin=1, xmax=20)
plt.plot(history.history['loss'])
plt.title('Loss curve', fontdict=fontLabels)
plt.ylabel('Loss', fontdict=fontLabels)
plt.xlabel('Epohcs', fontdict=fontLabels)
plt.legend(['Train'], loc='upper center', frameon=False, bbox_to_anchor=(0.50, 1.03), shadow=False, ncol=2, fontsize=axisLabelFont)
plt.show()


# In[9]:


# Testing/Prediction phase
predictions = model.predict(test_generator, verbose=1)
yPredictions = np.argmax(predictions, axis=1)
true_classes = test_generator.classes
# Display the performance of the model on test data
showResults(true_classes[:len(yPredictions)], yPredictions)


# In[10]:


# Save the model again if needed
model.save(r"D:\Mrinmayi\SE\PBL\imageClassificationModel.h5")


# In[7]:


import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Load the model once at startup
model = tf.keras.models.load_model(r"D:\Mrinmayi\SE\PBL\imageClassificationModel.h5")


# Class mapping (edit if needed)
class_labels = {0: "NORMAL", 1: "PNEUMONIA"}

# Function to predict a single image
def predict_image(image_path):
    try:
        img = image.load_img(image_path, target_size=(100, 100), color_mode="grayscale")
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize

        prediction = model.predict(img_array)
        class_idx = int(np.argmax(prediction))

        result = {
            "prediction": class_labels[class_idx],
            "confidence": float(prediction[0][class_idx])
        }
        return json.dumps(result)

    except Exception as e:
        return json.dumps({"error": str(e)})

# If run directly from terminal
if __name__ == "__main__":  # <- fixed this line (_name_ → __name__)
    import sys
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
    else:
        image_path = sys.argv[1]
        print(predict_image(image_path))


# In[ ]:




