import torch
import torchvision.transforms as transforms
import torchvision.transforms.functional as F
from torchvision.transforms import v2

first_transforms = v2.Compose([
    v2.ToImage(),
    v2.Resize(size=(512, 512), antialias=True),
    v2.ToDtype(torch.float32, scale=True)
])

# to display input image
def process_uploaded_image(input_image):
    img = first_transforms(input_image)
    img = F.to_pil_image(img)
    return img

# processing before segmentation (unet)
segment_transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor(),  # Convert the image to a tensor (C, H, W)
])

# processing before classification (shufflenet)
classification_preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])



