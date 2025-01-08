import streamlit as st
from PIL import Image
import torch
import torchvision.transforms as transforms
import numpy as np
import matplotlib.pyplot as plt
import torchvision.transforms.functional as F

# import functions
from process_image import process_uploaded_image, segment_transform
from map_diseased_areas import map_diseased_areas
from classification import predict_disease

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

## Load the models ##
ep_ = torch.export.load('models/export_Custom_classification.pt2')
classifier = ep_.module()

ep = torch.export.load('models/export_DeepLabV3.pt2')
segment_model = ep.module()

plt.rcParams["savefig.bbox"] = 'tight'

def main():
    st.markdown(
        """
        <style>
        [data-testid="stAppViewContainer"] {
            background-color: #073832;
        }
        [data-testid="stHeader"] {
            background-color: #073832;
        }
        .custom-title {
            font-size: 30px; /* Adjust font size of title here */
            font-weight: bold;
            margin-bottom: 10px; /* Optional: Add spacing below the title */
        }
        .custom-font {
            font-size: 20px;
        }
        .small-image img {
            width: 20%;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    st.markdown('<p class="custom-title">🍀🍂 Plant Disease Detection System 🪴🌱</p>', unsafe_allow_html=True)
    st.markdown('<p class="custom-font">Upload an image of your plant leaf!</p>', unsafe_allow_html=True)

    uploaded_image = st.file_uploader(label="None", type=["jpg", "png", "jpeg"], label_visibility="collapsed")

    if uploaded_image is not None:
        # Convert the uploaded image to a PIL Image object
        pil_image = Image.open(uploaded_image)
        processed_image = process_uploaded_image(pil_image)
        
        # Set up columns to display images side-by-side
        col1, col2 = st.columns(2)

        with col1:
            # display uploaded image directly
            st.markdown('<div class="small-image">', unsafe_allow_html=True)
            st.image(processed_image, caption="This is your uploaded image.")
            st.markdown('</div>', unsafe_allow_html=True)

        # just for alignment
        with col2:
            st.markdown("")
            
        # Add a button
        if st.button('Does my plant have a disease?'):
            ## Perform classification; display output class. If disease present, perform segmentation 
            predicted_disease = predict_disease(processed_image, classifier, device).replace('_', ' ')
            
            if predicted_disease == 'healthy':
                st.markdown('<p class="custom-font">No worries, your plant is likely healthy! 🌿</p>', unsafe_allow_html=True)
            else:
                st.markdown(f'<p class="custom-font">Your plant might be suffering from {predicted_disease}.</p>', unsafe_allow_html=True)
        
                ## Perform segmentation here
                img_tensor = segment_transform(pil_image).unsqueeze(0)
                with torch.no_grad():
                    out = segment_model(img_tensor)
                binary_out = (out > 0.5).float().squeeze(0)
                binary_out_image = F.to_pil_image(binary_out)
                
                diseased_areas_image = map_diseased_areas(processed_image, binary_out_image)
                
                with col2:
                    st.image(diseased_areas_image, caption=f"Diseased Areas with {predicted_disease}")

if __name__ == "__main__":
    main()
