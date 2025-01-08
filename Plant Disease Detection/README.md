# 50.035 Plant Disease Detection Project
## Introduction
This folder contains all the relevant files for our Plant Disease Detection project, as well as the runnable source code for our prototype. 

## Datasets and Models
### Image Classification

*SqueezeNet, ResNet50, MobileNetV2, ShuffleNetv2, EfficientNetB0, InceptionV3* and a *custom model* were trained on the [PlantVillage dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset).

### Image Segmentation

*UNet, UNet++, DeepLabV3 (with ResNet50), DeepLabV3 (with MobileNetv2)* and *MAnet* were trained on the [Leaf segmentation dataset](https://www.kaggle.com/datasets/fakhrealam9537/leaf-disease-segmentation-dataset).

## Contents
- `prototype demo.mp4`: A short demo video of our running prototype
- `user_interface`: Runnable source code for prototype
- `notebooks/Data_preparation.ipynb`: All data pre-processing steps for the *PlantVillage* dataset.
- `notebooks/Image Classification`: Folder containing all notebooks pertaining to image classification
- `notebooks/Image Segmentation`: Folder containing all notebooks pertaining to image segmentation
- `report`: Our final project report


## Instructions to run prototype code 
### 1. Downloading folder
Download the **user_interface** folder from this repository to your local storage, and navigate to its directory (e.g. `cd Downloads/user_interface`).


### 2. Creating a virtual environment
Within the folder, create a virtual environment with [**Python 3.11.1**](https://www.python.org/downloads/release/python-3111/)
```
python3.11 -m venv venv2
```

...and activate it (re-activate for every session).

- MacOS:
    ```
    source venv2/bin/activate
    ```

- Windows:
    ```
    venv2/Scripts/activate
    ```


### 3. Installing dependencies
Install all required libraries and dependencies within the environment.
```
pip install -r requirements.txt
```

### 4. Downloading our models
Download [this folder](https://drive.google.com/drive/folders/1k90o_kAQgsH8aOfjuPaBN3Q0N4QlntUN?usp=sharing) that contains our trained models, and insert it into the folder.

### 5. Running the webpage
Run the following command to start the Streamlit app.
```
streamlit run app.py
```
If the execution is successful, you should be automatically directed to the running application on your default web browser 👍
