from backend.db_manager import DbManager
from backend.utils import sha256
from backend.const import ReturnCode

def trace_callback(statement):
    print("Executing SQL:", statement)

class Session:
    def __init__(self):
        self.id = None

    def set_user(self,id):
        self.id = id

    def is_logged_in(self):
        return self.id is not None

class Controller:
    def __init__(self):
        self.dbm = DbManager(trace_callback)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)

        self.session = Session()

    def close(self):
        self.dbm.close()






    def authorize(self,login:str,password:str) -> int | ReturnCode:
        self.dbm.select_single_table('account',['id','password'],'login = ?',(login,))
        fetch = self.dbm.fetchone()
        if fetch is None:
            return ReturnCode.Auth.LOGIN_NOT_FOUND
        if fetch[1] == password:
            return fetch[0]
        return ReturnCode.Auth.WRONG_PASSWORD
    
    def login(self,id):
        self.session.set_user(id)
    
    def logout(self):
        self.session.set_user(None)


    def get_tasks(self) -> ReturnCode:
        if not self.session.is_logged_in():
            return ReturnCode.Sess.NOT_LOGGED_IN
        
        user_tasks_fetch_command = 'SELECT ' \
        'task.id, task.project, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task_user_assignment ' \
        'INNER JOIN task ' \
        'ON task_user_assignment.task = task.id ' \
        f'WHERE task_user_assignment.user = ?'
        self.dbm.execute(user_tasks_fetch_command,(self.session.id,))
        return self.dbm.fetchall()


