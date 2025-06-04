from backend.db_manager import DbManager
from backend.const import ReturnCode

from typing import Tuple

def trace_callback(statement):
    print("Executing SQL:", statement)


class Controller:
    def __init__(self):
        self.dbm = DbManager(None)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)

    def close(self) -> None:
        self.dbm.close()




    def get_account(self,login) -> Tuple[int,str,str] | ReturnCode.Auth:
        self.dbm.select_single_table('account',['id','login','password'],'login = ?',(login,))
        fetch = self.dbm.fetchone()
        if fetch is None:
            return ReturnCode.Auth.LOGIN_NOT_FOUND
        return fetch


    # def authorize(self,login:str,password:str) -> int | ReturnCode:
    #     self.dbm.select_single_table('account',['id','password'],'login = ?',(login,))
    #     fetch = self.dbm.fetchone()
    #     if fetch is None:
    #         return ReturnCode.Auth.LOGIN_NOT_FOUND
    #     if fetch[1] == password:
    #         return fetch[0]
    #     return ReturnCode.Auth.WRONG_PASSWORD
    


    def get_tasks(self,account_id):

        user_tasks_fetch_command = 'SELECT ' \
        'task.id, task.project, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task_user_assignment ' \
        'INNER JOIN task ' \
        'ON task_user_assignment.task = task.id ' \
        f'WHERE task_user_assignment.user = ?'
        
        self.dbm.execute(user_tasks_fetch_command,(account_id,))
        return self.dbm.fetchall()


