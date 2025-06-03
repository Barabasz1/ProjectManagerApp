from backend.db_manager import DbManager
from backend.utils import sha256



def trace_callback(statement):
    print("Executing SQL:", statement)

class Controller:
    def __init__(self):
        self.dbm = DbManager(trace_callback)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)








    def close(self):
        self.dbm.close()

    def authorize(self,login:str,password:str):
        hashed_password = sha256(password)

        print(self.dbm.select_single_table('account',['login','password'],f'login = {login}'))



