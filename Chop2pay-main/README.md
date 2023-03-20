# Chop2pay

##### Chop2Pay is a program designed for checkout kiosks at supermarkets using computer vision to replace barcode scanning to increase efficiency and reduce queueing time. It is made using Kivy for the interface, [Peeking duck library](https://peekingduck.readthedocs.io/en/stable/) for object detection of purchases and pandas to read prices from excel sheet that can be modified by supermarket staff.

### Important notes!!!

##### to enable the model to detect additional objects, go to process.py, look for processVid() and append the 
##### [class name](https://peekingduck.readthedocs.io/en/stable/resources/01a_object_detection.html#general-object-detection-ids) of the object to the list parameter of yolo.node . also add the corresponding name (exact same) under ITEMS column in Prices.xlsx
