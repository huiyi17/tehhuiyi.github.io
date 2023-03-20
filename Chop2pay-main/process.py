from pathlib import Path
import glob
import os
import asyncio
import pandas as pd
from peekingduck.pipeline.nodes.model import yolo
from peekingduck.pipeline.nodes.input import visual
from peekingduck.pipeline.nodes.draw import bbox, legend
from peekingduck.pipeline.nodes.output import media_writer, screen,csv_writer
from peekingduck.pipeline.nodes.input import visual
from peekingduck.pipeline.nodes.dabble import statistics
from peekingduck.runner import Runner

async def processVid():
    visual_node = visual.Node(source=str(Path.cwd() / "grocery.mp4"))
    yolo_node = yolo.Node(detect=["banana","apple","orange","bottle","broccoli","carrot"])
    bbox_node = bbox.Node(show_labels=True)
    screen_node = screen.Node()
    csv_writer_node = csv_writer.Node(stats_to_track=["bbox_labels"],file_path=str(Path.cwd().joinpath('csvOutputs') / "items.csv"),logging_interval=1, )

    runner = Runner(
        nodes=[
            visual_node,
            yolo_node,
            bbox_node,
            screen_node,
            csv_writer_node
        ]
    )
    runner.run()
def readItems(filePath):
    newlist = []
    # read in the csv generated from the source video within the same folder
    df = pd.read_csv(getLatestCsv(filePath))
    combined_labels = df['bbox_labels'].tolist()
    for l in combined_labels:
        new1 = l[1:]
        new2 = new1[:-1]
        new = new2.split()
        for item in new:
            newlist.append(item.replace("'",""))
    # set of unique values of items generated
    final = set(newlist)
    return final
def getLatestCsv(filePath):
    list_of_files = glob.glob(filePath+'/*.csv') # * means all if need specific format then *.csv
    latest_file = max(list_of_files, key=os.path.getctime)
    return latest_file

async def getItemList():
    await processVid()
    filePath=str(Path.cwd().joinpath('csvOutputs'))
    return readItems(filePath)

#asyncio.run(getItemList())


