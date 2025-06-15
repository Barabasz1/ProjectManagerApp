import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.controller import Controller

from backend.utils import get_now


# def task_add(
#     ctrl,
#     project_id:int,
#     task_name:str,
#     description:str,
#     deadline,
#     team_id: int | None = None 
# ):
#     data = [project_id,task_name,description,get_now(),deadline,1,0]
#     added_task = ctrl.insert_from_list('task',data)
#     print(added_task)
#     if team_id:
#         added_assignment = ctrl.insert_from_list('task_team_assignment',[added_task,team_id])
#         print(f' ADDED NEW ASSIGNMENT {added_assignment}')


if __name__ == "__main__":
    controller = Controller()

    result = controller.get_tasks_of_project_of_user(1,73,None,(None,None))

    print(result)
    # print(controller.get_account('Chlebeks'))
    # print(controller.get_non_teammembers(1))
    # print(controller.get_teammembers(1))
    # print(controller.get_teams(1))
    # print(controller.get_projects(1))
    # print(controller.get_tasks(1))


    # data = ['TEST PROJECT',1,'TEST DESCRIPTION',get_now(),None,None]
    # controller.insert_from_list('project',data)
    
    # print([list(vals.values()) for vals in controller.get_users()])

    # task_add(controller,1,'NEW TASK','NEW TASK DESCRITPNIO',r'2025/01/01 18:00',1)

    controller.close()
