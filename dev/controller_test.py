import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.controller import Controller

from backend.utils import get_now





if __name__ == "__main__":
    controller = Controller()


    # print(controller.get_account('Chlebeks'))
    # print(controller.get_non_teammembers(1))
    # print(controller.get_teammembers(1))
    # print(controller.get_teams(1))
    # print(controller.get_projects(1))
    # print(controller.get_tasks(1))


    data = ['TEST PROJECT',1,'TEST DESCRIPTION',get_now(),None,None]
    controller.insert_from_list('project',data)
    
    controller.close()
