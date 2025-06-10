from fastapi import FastAPI,Depends,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
from jwt.exceptions import InvalidTokenError
from contextlib import contextmanager

from typing import Annotated, Tuple, List
from datetime import datetime, timedelta, timezone
import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))

from backend.const import ReturnCode
from backend.controller import Controller
from backend.utils import get_now,get_now_str
from backend.request_structs.requests import *

SECRET_KEY = 'bae0a9511295b4d7243684f9eb2ddf92bce396a2dbca2302b1688b28bfe5c853'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class InvalidIDException(HTTPException):
    def __init__(self, detail: str = "The supplied ID is invalid"):
        super().__init__(status_code=460, detail=detail)

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




# returns:
#   token
#   HTTPexception - incorrect password/incorrect username(username not found)
@app.post("/token")
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


# returns token
@app.post("/register")
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

@app.post('/create_project')
async def create_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data:ProjectCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.user_exists(data.manager):
            raise get_invalid_id_exception()
        data = [data.project_name,data.manager,data.project_description,get_now(),None,None]
        ctrl.insert_from_list('project',data)


@app.post('/create_task')
async def create_task(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: TaskCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(data.project_id):
           raise get_invalid_id_exception()
        _data = [data.project_id,data.name,data.description,get_now(),data.deadline,1,0]
        added_task_id = ctrl.insert_from_list('task',_data)
        # print(added_task)
        if data.team_id:
            if not ctrl.team_exists(data.team_id):
                raise get_invalid_id_exception()
            added_assignment = ctrl.insert_from_list('task_team_assignment',[added_task_id,data.team_id])
            # print(f' ADDED NEW ASSIGNMENT {added_assignment}')


@app.post('/create_team')
async def create_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: TeamCreationReq
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(data.project_id):
            raise get_invalid_id_exception()
        ctrl.insert_from_list('team',[data.name,data.project_id])


@app.post('/add_user_to_team')
async def add_user_to_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: UserTeamAssignReq
):
    print("Received data:", data)
    with get_controller() as ctrl:
        if not ctrl.user_exists(data.user_id) or not ctrl.team_exists(data.team_id):
            raise get_invalid_id_exception()
        print("inserting ")
        print(data.user_id)
        print()
        result = ctrl.insert_from_list('team_composition',[data.team_id,data.user_id,data.role])
        if result == ReturnCode.Sql.INTEGRITY_ERROR:
            return None
        

@app.post('/add_task_to_team')
async def add_task_to_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    data: TaskTeamAssignReq
):
    with get_controller() as ctrl:
        if not ctrl.task_exists(data.task_id) or not ctrl.team_exists(data.team_id):
            raise get_invalid_id_exception()
        ctrl.insert_from_list('task_team_assignment',[data.task_id,data.team_id])

# ================================================================================================================================
#                                                               GETS
# ================================================================================================================================


@app.get('/hello_world')
async def hello_world():
    return {"message": "Hello World from fastapi :)"}



@app.get('/get_tasks_of_user/{user_id}')
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
    

@app.get('/get_tasks_of_project/{project_id}')
async def get_tasks_of_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(project_id):
            raise get_invalid_id_exception()
        return ctrl.get_tasks_of_project(project_id)

    
@app.get('/get_tasks')
async def get_tasks_of_project_of_user(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int,
    user_id:int
):
    if current_user.id != user_id:
        raise get_unathorized_exception()
    with get_controller() as ctrl:
        if not ctrl.user_exists(user_id) and not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        return ctrl.get_tasks_of_project_of_user(project_id,user_id)

@app.get('/get_projects/{user_id}')
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

    

@app.get('/get_teams/{project_id}')
async def get_teams(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        return ctrl.get_teams(project_id)
    

# returns [account_id,username]
@app.get('/get_users')
async def get_users():
    with get_controller() as ctrl:
        # return ctrl.get_users()
        return [list(vals.values()) for vals in ctrl.get_users()]
    
@app.get('/get_teammembers/{team_id}')
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
    
@app.get('/get_nonteammembers/{team_id}')
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


@app.delete('/delete_project/{project_id}')
async def delete_project(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id:int
):
    with get_controller() as ctrl:
        if not ctrl.project_exists(project_id):
            raise get_invalid_id_exception()
        ctrl.delete_project(project_id)



@app.delete('/delete_task/{task_id}')
async def delete_task(
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int
):
    with get_controller() as ctrl:
        if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
        ctrl.delete_task(task_id)


@app.delete('/delete_user/{user_id}',
            description="Deletes a user from the database. You can only delete a user, whose id corresponds to the user id of your session token")
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


@app.delete('/remove_user_from_team/{team_id}/{user_id}')
async def remove_user_from_team(
    current_user: Annotated[User, Depends(get_current_active_user)],
    team_id:int,
    user_id:int
):
    with get_controller() as ctrl:
        if not ctrl.team_exists(team_id) and not ctrl.user_exists(user_id):
            raise get_invalid_id_exception()
        ctrl.remove_user_from_team(user_id,team_id)



# ================================================================================================================================
#                                                           PATCHES
# ================================================================================================================================


@app.patch('/increase_task_status/{task_id}')
async def increase_task_status(
    current_user: Annotated[User, Depends(get_current_active_user)],
    task_id:int,
    data:TaskStatusChangeReq
):
    with get_controller() as ctrl:
        if not ctrl.task_exists(task_id):
            raise get_invalid_id_exception()
        ctrl.increase_task_status(task_id,data.amount)