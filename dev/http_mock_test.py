import asyncio
from fastapi import HTTPException, status
import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))
from backend.main import *
from datetime import datetime
from backend.utils import get_now
current_user = User(id=1, username="Chlebek")


async def get():
    print("\nGet teams")
    print(await get_teams(current_user,1))


    print("\nGet tasks of project")
    print(await get_tasks_of_project(current_user,1))


    print("\nGet tasks of user")
    print(await get_tasks_of_user(current_user,1))


    print("\nGet projects")
    print(await get_projects(current_user,1))


    print("\nGet users")
    print(await get_users())


    print("\nGet teammembers")
    print(await get_teammembers(current_user,1))


    print("\nGet nonteammembers")
    print(await get_nonteammembers(current_user,1))

async def post():
    # print("\ncreate project")
    # print(await create_project(current_user,ProjectCreationReq(project_name='mock',project_description='mock')))

    # print("\ncreate task")
    # print(await create_task(current_user,TaskCreationReq(project_id=1,name='mock',description='mock desc',deadline=datetime.now(),team_id=2)))


    # print("\ncreate team")
    # print(await create_team(current_user,TeamCreationReq(name="mock",project_id=1)))


    print("\nadd user to team")
    print(await add_user_to_team(current_user,UserTeamAssignReq(user_id=1000,team_id=6,role='MOCK ROLE')))


    # print("\nadd task to team")
    # print(await add_task_to_team(current_user,TaskTeamAssignReq(task_id=20,team_id=10)))

async def delete():
    # print("deleting proejct")
    # print(await delete_project(current_user=current_user,project_id=1))

    # print("deleting task")
    # print(await delete_task(current_user=current_user,task_id=1))

    # print("deleting user")
    # print(await delete_user(current_user=current_user,user_id=1))

    print("remove user from team")
    print(await remove_user_from_team(current_user=current_user,user_id=1,team_id=10))

async def patch():

    print("increasing status")
    print(await increase_task_status(current_user,1,TaskStatusChangeReq(amount=1)))

    print("decreasing status")
    print(await increase_task_status(current_user,1,TaskStatusChangeReq(amount=20)))

    print("decreasing status by 20")
    print(await increase_task_status(current_user,1,TaskStatusChangeReq(amount=20)))


async def main():

    # await get()
    # await post()
    await delete()
    # await patch()




asyncio.run(main())
