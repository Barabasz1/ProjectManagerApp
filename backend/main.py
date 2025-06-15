from fastapi import FastAPI,Depends,HTTPException,status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
from jwt.exceptions import InvalidTokenError
from contextlib import contextmanager
from enum import Enum

from typing import Annotated, Tuple, List
from datetime import datetime, timedelta, timezone
import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))

from backend.const import ReturnCode
from backend.controller import Controller
from backend.utils import get_now,clean_dict,filter_out_not_set,get_datetime_utc,datetime_to_native
from backend.request_structs.requests import *

SECRET_KEY = 'bae0a9511295b4d7243684f9eb2ddf92bce396a2dbca2302b1688b28bfe5c853'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class InvalidIDException(HTTPException):
    def __init__(self, detail: str = "The supplied ID is invalid"):
        super().__init__(status_code=460, detail=detail)

invalid_id_response = {
    460: {"description": "The supplied ID is invalid"}
}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

@contextmanager
def get_controller():
    controller = Controller()
    try:
        yield controller
    finally:
        controller.close()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    id: int # account id
    username: str 

# user confidential
class UserCon(User):
    hashed_password: str



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    return pwd_context.hash(password)

def get_user(controller:Controller, username: str) -> UserCon | ReturnCode.Auth:
    res = controller.get_account(username)
    if res == ReturnCode.Auth.LOGIN_NOT_FOUND:
        return res
    return UserCon(id=res['id'],username=res['login'],hashed_password=res['password'])


def get_invalid_id_exception():
    return InvalidIDException()

def get_unathorized_exception():
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized request")


def authenticate_user(controller, username: str, password: str) -> UserCon | ReturnCode.Auth:
    _user = get_user(controller,username)
    if _user == ReturnCode.Auth.LOGIN_NOT_FOUND:
        return _user

    if not verify_password(password, _user.hashed_password):
        return ReturnCode.Auth.WRONG_PASSWORD
    return _user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    with get_controller() as ctrl:
        user = get_user(ctrl, username=token_data.username)

    if user == ReturnCode.Auth.LOGIN_NOT_FOUND:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    # check if user is disabled here
    return current_user






# ================================================================================================================================
#                                                               POSTS
# ================================================================================================================================


@app.post("/token", summary="Login", description="Authenticate a user and return an access token.")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    with get_controller() as control:
        user = authenticate_user(control, form_data.username, form_data.password)

    if user == ReturnCode.Auth.LOGIN_NOT_FOUND:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user == ReturnCode.Auth.WRONG_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username,"user_id":user.id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@app.post("/register",summary="Register", description="Register a new user and return an access token.")
async def register(
    data: RegisterReq
):
    with get_controller() as ctrl:
        if not ctrl.is_login_unique(data.login):
            raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Username already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )


        password_hashed = get_password_hash(data.password)

        new_user_id = ctrl.register_account(data.login,password_hashed)
        user = User(id=new_user_id,username=data.login)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username,"user_id":user.id}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")

@app.post('/create_project', summary="Create Project", description="Create a new project with a name, manager, and description.",responses=invalid_id_response)
async def create_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data:ProjectCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.user_exists(data.manager):
            raise get_invalid_id_exception()
        data = [data.project_name,data.manager,data.project_description,get_now(),None,None]
        ctrl.insert_from_list('project',data)


@app.post('/create_task', summary="Create Task", description="Create a new task under a specific project, optionally assigning it to a team.",responses=invalid_id_response)
async def create_task(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: TaskCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(data.project_id):
           raise get_invalid_id_exception()
        _data = [data.project_id,data.name,data.description,get_now(),data.deadline,data.status,data.priority]
        added_task_id = ctrl.insert_from_list('task',_data)
        if data.team_id:
            if not ctrl.team_exists(data.team_id):
                raise get_invalid_id_exception()
            ctrl.insert_from_list('task_team_assignment',[added_task_id,data.team_id])


@app.post('/create_team', summary="Create Team", description="Create a team within a specified project.",responses=invalid_id_response)
async def create_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: TeamCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(data.project_id):
            raise get_invalid_id_exception()
        ctrl.insert_from_list('team',[data.name,data.project_id])


@app.post('/add_user_to_team', summary="Add User to Team", description="Assign a user to a team with a specified role.",responses=invalid_id_response)
async def add_user_to_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: UserTeamAssignReq
):
    with get_controller() as ctrl:
        if not ctrl.user_exists(data.user_id) or not ctrl.team_exists(data.team_id):
            raise get_invalid_id_exception()

        result = ctrl.insert_from_list('team_composition',[data.team_id,data.user_id,data.role])
        if result == ReturnCode.Sql.INTEGRITY_ERROR:
            return None
        

@app.post('/task_team_bind/{task_id}',
          summary="Bind/Unbind Task to/from Team",
          description="""
Bind or unbind a task to a team.  
Modes:
- `assign`: Assign the task to the specified team.  
- `unassign`: Remove the task from the specified team.  
- `unassign_all`: Remove the task from all teams.
""",responses=invalid_id_response)
async def task_team_bind(
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int,
    team_id: Optional[int] = Query(None, description="Required unless bind_mode is 'unassign_all')"),
    bind_mode: BindModeQP = Query(BindModeQP.assign, description="Bind mode: assign, unassign, or unassign_all")
):
    with get_controller() as ctrl:

        if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
        
        match bind_mode:
            case BindModeQP.assign | BindModeQP.unassign:
                if team_id is None or not ctrl.team_exists(team_id):
                    raise get_invalid_id_exception()
                
                match bind_mode:
                    case BindModeQP.assign:
                        ctrl.insert_from_list('task_team_assignment',[task_id,team_id])

                    case BindModeQP.unassign:
                        ctrl.delete_task_team_bind(task_id,team_id)

            case BindModeQP.unassign_all:
                ctrl.delete_task_team_bind(task_id,None)

            case _:
                pass


# ================================================================================================================================
#                                                               GETS
# ================================================================================================================================


@app.get('/get_tasks_of_user/{user_id}', summary="Get User's Tasks", description="Retrieve all tasks assigned to a specific user. Only the user themselves can access this.",responses=invalid_id_response)
async def get_tasks_of_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    user_id:int
):
    if current_user.id != user_id:
        raise get_unathorized_exception()
    with get_controller() as ctrl:
        if not ctrl.user_exists(user_id):
            raise get_invalid_id_exception()
        return ctrl.get_tasks_of_user(user_id)
    

@app.get('/get_tasks_of_project/{project_id}', summary="Get Project Tasks", description="Retrieve all tasks associated with a specific project.",responses=invalid_id_response)
async def get_tasks_of_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(project_id):
            raise get_invalid_id_exception()
        return ctrl.get_tasks_of_project(project_id)

    
@app.get('/get_tasks', summary="Get User's Tasks in Project", description="Retrieve tasks assigned to a user within a specific project, with optional sorting and date filtering.",responses=invalid_id_response)
async def get_tasks_of_project_of_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int,
    user_id:int,
    sort: TaskSortByQP | None = None,
    sort_order: SortOrderQP | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
):
    with get_controller() as ctrl:
        if not ctrl.user_exists(user_id) or not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        
        date_range = (datetime_to_native(date_from),datetime_to_native(date_to))

        if sort is not None:
            return ctrl.get_tasks_of_project_of_user(project_id,user_id,f'ORDER BY task.{sort.value} {sort_order.value.upper() if sort_order is not None else "ASC"}',date_range)

        else:
            return ctrl.get_tasks_of_project_of_user(project_id,user_id,None,date_range)


@app.get('/get_projects/{user_id}', summary="Get User's Projects", description="Retrieve all projects associated with a specific user. Only the user themselves can access this.",responses=invalid_id_response)
async def get_projects(
    current_user: Annotated[User, Depends(get_current_active_user)],
    user_id:int
):
    if current_user.id != user_id:
        raise get_unathorized_exception()
    with get_controller() as ctrl:
        if not ctrl.user_exists(user_id):
            raise get_invalid_id_exception()
        return ctrl.get_projects(user_id)

    

@app.get('/get_teams/{project_id}', summary="Get Project Teams", description="Retrieve all teams that belong to a specified project.",responses=invalid_id_response)
async def get_teams(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        return ctrl.get_teams(project_id)
    

@app.get('/get_users', summary="Get All Users", description="Retrieve a list of all registered users. Returns user IDs and usernames.",responses=invalid_id_response)
async def get_users():
    with get_controller() as ctrl:
        # return ctrl.get_users()
        return [list(vals.values()) for vals in ctrl.get_users()]
    
@app.get('/get_teammembers/{team_id}', summary="Get Team Members", description="Retrieve all members of a specified team.",responses=invalid_id_response)
async def get_teammembers(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(team_id):
            raise get_invalid_id_exception()
        result = ctrl.get_teammembers(team_id)
        # return result
        return [list(vals.values()) for vals in result]
    
@app.get('/get_nonteammembers/{team_id}', summary="Get Non-Team Members", description="Retrieve users who are not part of the specified team.",responses=invalid_id_response)
async def get_nonteammembers(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(team_id):
            raise get_invalid_id_exception()
        result = ctrl.get_non_teammembers(team_id)
        # return  result
        return  [list(vals.values()) for vals in result]

# ================================================================================================================================
#                                                           DELETES
# ================================================================================================================================


@app.delete('/delete_project/{project_id}', summary="Delete Project", description="Delete a project by its ID. Requires the project to exist.",responses=invalid_id_response)
async def delete_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        ctrl.delete_project(project_id)



@app.delete('/delete_task/{task_id}', summary="Delete Task", description="Delete a task by its ID. Requires the task to exist.",responses=invalid_id_response)
async def delete_task(
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int
):
    with get_controller() as ctrl:
        if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
        ctrl.delete_task(task_id)
        

@app.delete('/delete_team/{team_id}', summary="Delete Team", description="Delete a team by its ID. Requires the team to exist.",responses=invalid_id_response)
async def delete_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(team_id):
            raise get_invalid_id_exception()
        ctrl.delete_team(team_id)


@app.delete('/delete_user/{user_id}', summary="Delete User", description="Deletes a user from the database. Only the authenticated user can delete their own account.",responses=invalid_id_response)
async def delete_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    user_id:int
):
    if current_user.id == user_id:
        with get_controller() as ctrl:
            if not ctrl.user_exists(user_id):
                raise get_invalid_id_exception()
            ctrl.delete_user(user_id)
    else:
        raise get_unathorized_exception()


@app.delete('/remove_user_from_team/{team_id}/{user_id}', summary="Remove User from Team", description="Remove a user from a specified team. Requires both team and user to exist.",responses=invalid_id_response)
async def remove_user_from_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int,
    user_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(team_id) or not ctrl.user_exists(user_id):
            raise get_invalid_id_exception()
        ctrl.remove_user_from_team(user_id,team_id)



# ================================================================================================================================
#                                                           PATCHES
# ================================================================================================================================


@app.patch('/increase_task_status/{task_id}',
           summary="Increase Task Status",
           description="Increase the status level of a task by a specified amount. Task must exist.",responses=invalid_id_response)
async def increase_task_status(
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int,
    data:TaskStatusChangeReq
):
    with get_controller() as ctrl:
        if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
        ctrl.increase_task_status(task_id,data.amount)


@app.patch('/edit_task/{task_id}',
           summary="Edit Task",
           description="Update fields of an existing task. Only fields provided will be updated.",responses=invalid_id_response)
async def edit_task(    
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int,
    data:TaskEditReq
):
    
    with get_controller() as ctrl:
       if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
       ctrl.update_task(task_id,filter_out_not_set({
           'name':data.name,
           'description':data.description,
           'deadline':data.deadline,
           'status':data.status,
           'priority':data.priority
        },data.model_fields_set))
       
@app.patch('/edit_user/{user_id}',
           summary="Edit User Profile",
           description="Edit user's profile information such as name, email, or description.",responses=invalid_id_response)
async def edit_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    user_id:int,
    data:UserEditReq
):
    with get_controller() as ctrl:
        if not ctrl.user_exists(user_id):
            raise get_invalid_id_exception()
        ctrl.update_user(user_id,filter_out_not_set({
           'f_name':data.f_name,
           'l_name':data.l_name,
           'email':data.email,
           'description':data.description
           },data.model_fields_set))


@app.patch('/edit_account/{account_id}',
           summary="Edit Account Credentials",
           description="Update login credentials of an account such as username or password.",responses=invalid_id_response)
async def edit_account(
    current_user: Annotated[User, Depends(get_current_active_user)],
    account_id:int,
    data:AccountEditReq
):
    with get_controller() as ctrl:
       if not ctrl.user_exists(account_id):
            raise get_invalid_id_exception()
       ctrl.update_account(account_id,filter_out_not_set({
           'login':data.login,
           'password':data.password,
           },data.model_fields_set))

@app.patch('/edit_team/{team_id}',
           summary="Edit Team",
           description="Update the name of a team.",responses=invalid_id_response)
async def edit_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int,
    data:TeamEditReq
):
    with get_controller() as ctrl:
       if not ctrl.team_exists(team_id):
            raise get_invalid_id_exception()
       ctrl.update_team(team_id,filter_out_not_set({
           'name':data.name,
           },data.model_fields_set))

@app.patch('/edit_project/{project_id}',
           summary="Edit Project",
           description="Update a project's fields such as name, manager, description, version, or deadline.",responses=invalid_id_response)
async def edit_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int,
    data:ProjectEditReq
):
    with get_controller() as ctrl:
       if not ctrl.project_exists(project_id) or ('manager' in data.model_fields_set and data.manager is not None and not ctrl.user_exists(data.manager)):
            raise get_invalid_id_exception()
       ctrl.update_project(project_id,filter_out_not_set({
           'name':data.name,
           'manager':data.manager,
           'description':data.description,
           'version':data.version,
           'deadline':data.deadline
           },data.model_fields_set))