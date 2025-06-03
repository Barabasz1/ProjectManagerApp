from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/hello_world")
async def root():
    return {"message": "Hello World using fastapi :)"}
