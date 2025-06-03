from backend.db_manager import DbManager
from backend.const import ReturnCode

def trace_callback(statement):
    print("Executing SQL:", statement)


class Controller:
    def __init__(self):
        self.dbm = DbManager(trace_callback)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)

    def close(self):
        self.dbm.close()




    def get_account(self,login):
        self.dbm.select_single_table('account',['login','password'],'login = ?',(login,))
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
    


    def get_tasks(self,account_id) -> ReturnCode:

        user_tasks_fetch_command = 'SELECT ' \
        'task.id, task.project, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task_user_assignment ' \
        'INNER JOIN task ' \
        'ON task_user_assignment.task = task.id ' \
        f'WHERE task_user_assignment.user = ?'
        self.dbm.execute(user_tasks_fetch_command,(account_id,))
        return self.dbm.fetchall()


