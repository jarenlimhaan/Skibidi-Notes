import os
from termcolor import colored


def clean_dir(path: str) -> None:
    if not os.path.exists(path):
        os.mkdir(path)
    for file in os.listdir(path):
        file_path = os.path.join(path, file)
        os.remove(file_path)
