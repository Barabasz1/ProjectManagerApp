from pydantic import BaseModel, Field

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
    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    deadline: Optional[datetime] = Field(default=None)
    status: Optional[int] = Field(default=None)
    priority: Optional[int] = Field(default=None)

class ProjectEditReq(BaseModel):
    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    manager: Optional[int] = Field(default=None)
    version: Optional[str] = Field(default=None)
    deadline: Optional[datetime] = Field(default=None)

class AccountEditReq(BaseModel):
    login: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)

class UserEditReq(BaseModel):
    f_name: Optional[str] = Field(default=None)
    l_name: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)

class TeamEditReq(BaseModel):
    name: Optional[str] = Field(default=None)



class BindMode(str, Enum):
    assign = "assign"
    unassign = "unassign"
    unassign_all = "unassign_all"