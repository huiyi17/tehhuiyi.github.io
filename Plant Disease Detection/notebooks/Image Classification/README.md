**Models Tested:**
Our study evaluated multiple state-of-the-art convolutional neural network architectures to determine the optimal model for our classification task. The following architectures were investigated:
1. SqueezeNet: A compact architecture achieving AlexNet-level accuracy with significantly fewer parameters through its fire module design, combining squeeze and expand layers for efficient model size reduction.
2. ResNet50: A deep residual network employing residual connections through 50 convolutional layers to address the vanishing gradient problem and enable effective training of deep architectures through identity mappings.4
3. MobileNetV2: An architecture optimized for mobile and edge devices that utilizes depthwise separable convolutions to reduce computational complexity while maintaining effective feature extraction capabilities.4
4. ShuffleNetv2: A lightweight architecture that implements channel splitting and shuffling operations, designed for mobile devices to achieve optimal balance between computational efficiency and model accuracy.4
5. EfficientNet-BO: An architecture developed using compound scaling methodology that optimizes network depth, width, and input resolution simultaneously through compound coefficients.4
6. InceptionV3: A deep convolutional neural network (CNN) architecture designed for image classification and recognition tasks. It is an improved version of the Inception architecture introduced by Google, known for achieving high accuracy while being computationally efficient.
7. Custom Model: 
  * Inspired by lightweight architecture of ShuffleNetV2
  * Initial convolution, max pooling
  * Sequential ShuffleBlocks
  * Final convolution
  * Fully connected

