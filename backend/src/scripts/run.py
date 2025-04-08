import os 
from subprocess import run 

def dev():
    run(['uvicorn', 'main:app', '--port', '5000', '--reload' ])