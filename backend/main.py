from fastapi import FastAPI,Depends,HTTPException,status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel
import jwt
from jwt.exceptions import InvalidTokenError
from contextlib import contextmanager

from typing import Annotated, Tuple
from datetime import datetime, timedelta, timezone
import sys
import os
sys.path.append(os.path.abspath(os.path.join(__file__, '..','..')))

from backend.const import ReturnCode
from controller import Controller


SECRET_KEY = 'bae0a9511295b4d7243684f9eb2ddf92bce396a2dbca2302b1688b28bfe5c853'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


# returns token
@app.post("/register")
async def register(
    login:str,
    password:str
):
    with get_controller() as ctrl:
        if not ctrl.is_login_unique(login):
            raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Username already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )


        password_hashed = get_password_hash(password)

        new_user_id = ctrl.register_account(login,password_hashed)
        user = User(id=new_user_id,username=login)

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")




# ================================================================================================================================
#                                                               GETS
# ================================================================================================================================


@app.get('/hello_world')
async def hello_world():
    return {"message": "Hello World using fastapi :)"}



@app.get('/get_tasks')
async def get_tasks(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    with get_controller() as ctrl:
        return ctrl.get_tasks(current_user.id)


@app.get('/get_projects')
async def get_projects(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    with get_controller() as ctrl:
        return ctrl.get_projects(current_user.id)
    

@app.get('/get_teams')
async def get_teams(
    current_user: Annotated[User, Depends(get_current_active_user)],
    project_id
):
    with get_controller() as ctrl:
        return ctrl.get_teams(project_id)
    
