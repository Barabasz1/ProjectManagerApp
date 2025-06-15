# BACKEND STRUCTURE

Everything related to backend is in <projectroot>/backend/

/backend/
|   request_structs/
|   |   requests.py
|   const.py
|   controller.py
|   db_manager.py
|   main.py
|   utils.py


main.py - module responsible for fastapi
request_structs/requests.py - contains structs used as parameters or request body in api requests
controller.py - contatins class Controller responsible for executing various, specific commands on the database
db_manager.py - contains class DbManager responsible for creating, opening and maintaining connection to an .sql database file
utils.py - utility funtions used in various modules
const.py - const values and returns codes used in various modules



### main.py

- Contains each GET,POST,DELETE,PATCH api endpoint
- If an endpoint needs access to data in database it creates a connection using class Controller from controller.py
- Each connection with controller is 'atomic'. After an endpoint end, the connection with controller is closed. This ensures that each change in database is a transaction and every change is saved