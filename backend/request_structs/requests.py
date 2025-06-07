from pydantic import BaseModel
from datetime import datetime

class RegisterReq(BaseModel):
    login:str
    password:str

class ProjectCreationReq(BaseModel):
    project_name:str
    project_description:str

class TaskCreationReq(BaseModel):
    project_id:int
    name:str
    description:str
    deadline:datetime
    team_id: int | None = None 

class TeamCreationReq(BaseModel):
    name:str
    project_id:int

class TaskStatusChangeReq(BaseModel):
    amount:int

class UserTeamAssignReq(BaseModel):
    user_id:int
    team_id:int
    role:str

class TaskTeamAssignReq(BaseModel):
    task_id:int
    team_id:int