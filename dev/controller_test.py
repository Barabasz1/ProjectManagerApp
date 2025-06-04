import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.controller import Controller






if __name__ == "__main__":
    controller = Controller()


    fetch = controller.get_teams(1)

    print(fetch)


    controller.close()
