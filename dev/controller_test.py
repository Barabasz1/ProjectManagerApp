import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.controller import Controller






if __name__ == "__main__":
    controller = Controller()

    id = controller.authorize('Chlebek','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8')
    if isinstance(id,int):
        controller.login(id)
        for x in controller.get_tasks():
            print(x)



    controller.close()
