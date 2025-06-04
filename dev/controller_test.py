import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.controller import Controller






if __name__ == "__main__":
    controller = Controller()

    
    for x in controller.get_projects(1):
        print(x)


    controller.close()
