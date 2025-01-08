from PIL import Image
import numpy as np
import PIL

def map_diseased_areas(original_image: Image.Image, binary_mask: Image.Image) -> Image.Image:
    binary_mask = binary_mask.resize(original_image.size)
    original_array = np.array(original_image)
    mask_array = np.array(binary_mask)
    mask_array = mask_array > 128  # Assuming white regions in the mask are >128 intensity

    if len(mask_array.shape) == 2:  # If mask is grayscale
        mask_array = mask_array[:, :, np.newaxis]  # Add channel dimension for broadcasting

    # Apply the mask to the original image
    diseased_areas_array = np.where(mask_array, original_array, 0)  # Keep only the diseased areas
    diseased_areas_image = Image.fromarray(diseased_areas_array.astype('uint8'))

    return diseased_areas_image
