from backend.db_manager import DbManager
from backend.const import ReturnCode

from typing import Tuple, List

def trace_callback(statement):
    print("Executing SQL:", statement)


class Controller:
    def __init__(self):
        # self.dbm = DbManager(trace_callback)
        self.dbm = DbManager(None)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)

    def close(self) -> None:
        self.dbm.close()




    def get_account(self,login) -> dict | ReturnCode.Auth:
        # self.dbm.select_single_table('account',['id','login','password'],'login = ?',(login,))
        command = 'SELECT id, login, password FROM account WHERE login = ?'
        self.dbm.execute(command,(login,))
        fetch = self.dbm.fetchone()
        if fetch is None:
            return ReturnCode.Auth.LOGIN_NOT_FOUND
        return fetch
    

    def get_tasks(self,account_id) -> List[dict]:

        user_tasks_fetch_command = 'SELECT ' \
        'task.id, task.project, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task_user_assignment ' \
        'INNER JOIN task ' \
        'ON task_user_assignment.task = task.id ' \
        f'WHERE task_user_assignment.user = ?'
        
        self.dbm.execute(user_tasks_fetch_command,(account_id,))
        return self.dbm.fetchall()
    
    def get_projects(self,user_id) -> List[dict]:
        command = 'SELECT ' \
        'project.id, project.name, project.manager, project.description, project.creation_date, project.version, project.deadline ' \
        'FROM project ' \
        'INNER JOIN team ' \
        'ON team.project = project.id ' \
        'INNER JOIN team_composition ' \
        'ON team_composition.team = team.id ' \
        'WHERE team_composition.user = ? ' \
        'UNION ' \
        'SELECT ' \
        'project.id, project.name, project.manager, project.description, project.creation_date, project.version, project.deadline ' \
        'FROM project ' \
        'WHERE project.manager = ? ' \
        'ORDER BY project.id ASC'

        self.dbm.execute(command,(user_id,user_id))
        return self.dbm.fetchall()
    
    
    def get_teams(self,project_id) -> List[dict]:
        command = 'SELECT id, name ' \
        'FROM team ' \
        'WHERE project = ? ' \
        'ORDER BY team.id'

        self.dbm.execute(command,(project_id,))
        return self.dbm.fetchall()

    
    def get_teammembers(self,team_id) -> List[dict]:
        command = 'SELECT team_composition.user ' \
        'FROM team_composition ' \
        'INNER JOIN team ' \
        'ON team.id = team_composition.team ' \
        'WHERE team.id = ? ' \
        'ORDER BY team_composition.user'

        self.dbm.execute(command,(team_id,))
        return self.dbm.fetchall()

    # same project - but not in the team
    def get_non_teammembers(self,team_id) -> List[dict]:
        command = 'SELECT team_composition.user ' \
        'FROM team_composition ' \
        'INNER JOIN team ' \
        'ON team.id = team_composition.team ' \
        'INNER JOIN project ' \
        'ON project.id = team.project ' \
        'WHERE team.id <> ? ' \
        'AND team.project = (SELECT project FROM team WHERE id = ?) ' \
        'ORDER BY team_composition.user'

        self.dbm.execute(command,(team_id,team_id))
        return self.dbm.fetchall()
    

    def is_login_unique(self,login) -> dict | None:
        command = 'SELECT COUNT(*) AS count FROM account WHERE account.login = ?'
        self.dbm.execute(command,(login,))
        return self.dbm.fetchone()['count'] == 0 
    

    # returns id of newly created user
    def register_account(self,login,password_hashed) -> int:
        self.dbm._insert_single('account',{
            'login':login,
            'password':password_hashed
        })
        self.dbm.commit()

        self.dbm.execute('SELECT id FROM account WHERE login = ?',(login,))
        fetch = self.dbm.fetchone()
        return fetch['id']
        


