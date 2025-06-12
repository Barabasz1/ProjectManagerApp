from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
class RegisterReq(BaseModel):
    login:str
    password:str

class ProjectCreationReq(BaseModel):
    project_name:str
    project_description:str
    manager:int

class TaskCreationReq(BaseModel):
    project_id:int
    name:str
    description:str
    deadline:datetime
    status: int
    priority: int 
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

class TaskStatusChangeReq(BaseModel):
    amount:int


# edits

class TaskEditReq(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[int] = None
    priority: Optional[int] = None

class ProjectEditReq(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager: Optional[int] = None
    version: Optional[str] = None
    deadline: Optional[datetime] = None

class AccountEditReq(BaseModel):
    login: Optional[str] = None
    password: Optional[str] = None

class UserEditReq(BaseModel):
    f_name: Optional[str] = None
    l_name: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None

class TeamEditReq(BaseModel):
    name: Optional[str] = None



class BindMode(str, Enum):
    assign = "assign"
    unassign = "unassign"
    unassign_all = "unassign_all"