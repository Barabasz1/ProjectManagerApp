from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from const import ReturnCode
from controller import Controller

app = FastAPI()

controller = Controller()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/hello_world')
async def hello_world():
    return {"message": "Hello World using fastapi :)"}


# if successful - logs in
# else 
@app.get('/login')
async def login(login,password_hashed):
    result = controller.authorize(login,password_hashed)
    
    match result:
        case ReturnCode.Auth.LOGIN_NOT_FOUND:
            return {'message':'Login not found'}
        case ReturnCode.Auth.WRONG_PASSWORD:
            return {'message':'Wrong password'}
        case _:
            controller.login(result)
            return {'message':'Login successful'}



@app.post('/logout')
async def logout():
    controller.logout()


# gets tasks of the current user
@app.get('/get_tasks')
async def get_tasks():
    return controller.get_tasks()