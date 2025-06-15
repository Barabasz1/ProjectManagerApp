from backend.db_manager import DbManager
from backend.const import ReturnCode
from backend.utils import get_now

from typing import Tuple, List
from datetime import datetime


class Controller:
    def __init__(self):
        self.dbm = DbManager(None)
        self.dbm.open(DbManager.DEFAULT_DB_PATH)

    def close(self) -> None:
        self.dbm.close()


    def get_account(self,login) -> dict | ReturnCode.Auth:

        command = 'SELECT id, login, password FROM account WHERE login = ?'
        self.dbm.execute(command,(login,))
        fetch = self.dbm.fetchone()
        if fetch is None:
            return ReturnCode.Auth.LOGIN_NOT_FOUND
        return fetch
    
    def get_tasks_of_project_of_user(self,project_id,user_id,order_by_command:str | None = None,date_range:Tuple[datetime | None,datetime | None] = (None,None)) -> List[dict]:

        command = 'SELECT DISTINCT ' \
        'task.id, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task ' \
        'INNER JOIN project ' \
        'ON project.id = task.project ' \
        'INNER JOIN task_team_assignment ' \
        'ON task_team_assignment.task = task.id ' \
        'INNER JOIN team_composition ' \
        'ON team_composition.team = task_team_assignment.team ' \
        'INNER JOIN team ' \
        'ON team.project = project.id ' \
        'WHERE task.project = ? ' \
        'AND team_composition.user = ? ' \
        'AND team.project = task.project' \
        
        match date_range:
            case (None,None):
                params = (project_id,user_id)
            case (None,_):
                params = (project_id,user_id,date_range[0])
                command += f' AND task.deadline >= ?'
            case (_,None):
                params = (project_id,user_id,date_range[1])
                command += f' AND task.deadline <= ?'
            case _:
                params = (project_id,user_id,date_range[0],date_range[1])
                command += f' AND task.deadline >= ? AND task.deadline <= ?'

        if order_by_command is not None:    
            command+= f' {order_by_command}'

        self.dbm.execute(command,params)
        return self.dbm.fetchall()

    def get_tasks_of_user(self,account_id) -> List[dict]:

        command = 'SELECT ' \
        'task.id, task.project, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task_user_assignment ' \
        'INNER JOIN task ' \
        'ON task_user_assignment.task = task.id ' \
        f'WHERE task_user_assignment.user = ?'
        
        self.dbm.execute(command,(account_id,))
        return self.dbm.fetchall()

    def get_tasks_of_project(self,project_id) -> List[dict]:
        command = 'SELECT ' \
        'task.id, task.name, task.description, task.creation_date, task.deadline, task.status, task.priority ' \
        'FROM task ' \
        'WHERE task.project = ?'
        
        self.dbm.execute(command,(project_id,))
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
        command = 'SELECT team_composition.user AS user_id, account.login AS username ' \
        'FROM team_composition ' \
        'INNER JOIN team ' \
        'ON team.id = team_composition.team ' \
        'INNER JOIN account ' \
        'ON account.id = team_composition.user ' \
        'WHERE team.id = ? ' \
        'ORDER BY username'

        self.dbm.execute(command,(team_id,))
        return self.dbm.fetchall()

    def get_non_teammembers(self,team_id) -> List[dict]:
        command = 'SELECT account.id AS user_id, account.login AS username ' \
        'FROM account ' \
        'WHERE account.id NOT IN ' \
        '(SELECT user FROM team_composition WHERE team = ?) ' \
        'ORDER BY account.login'
        
        self.dbm.execute(command,(team_id,))
        return self.dbm.fetchall()
    
    def get_users(self) -> List[dict]:
        command = 'SELECT id, login FROM account ORDER BY login, id'

        self.dbm.execute(command,())
        return self.dbm.fetchall()

    

    def is_login_unique(self,login) -> dict | None:
        command = 'SELECT COUNT(*) AS count FROM account WHERE account.login = ?'
        self.dbm.execute(command,(login,))
        return self.dbm.fetchone()['count'] == 0 
    
    def check_existence(self,table_name,column_name,value):
        command = f'SELECT COUNT(*) AS count FROM {table_name} WHERE {column_name} = ?'
        self.dbm.execute(command,(value,))
        return self.dbm.fetchone()['count'] > 0 
    
    def project_exists(self,id):
        return self.check_existence('project','id',id)
    
    def task_exists(self,id):
        return self.check_existence('task','id',id)
    
    def user_exists(self,id):
        return self.check_existence('account','id',id)
    
    def team_exists(self,id):
        return self.check_existence('team','id',id)

    # returns id of newly created user
    def register_account(self,login,password_hashed) -> int:
        self.dbm._insert_single('account',{
            'login':login,
            'password':password_hashed,
            'creation_date':get_now()
        })
        self.dbm.commit()

        self.dbm.execute('SELECT id FROM account WHERE login = ?',(login,))
        fetch = self.dbm.fetchone()
        return fetch['id']
    

    def insert_from_dict(self,table_name:str,data:dict):
        self.dbm._insert_single(table_name,data)
        new_row = self.dbm.get_lastrowid()
        self.dbm.commit()
        return new_row

    def insert_from_list(self,table_name:str,data):
        dictionary = dict(zip(DbManager.TABLES_INSERT_FIELDS[table_name],data))
        rc = self.dbm._insert_single(table_name,dictionary)
        if rc == ReturnCode.Sql.INTEGRITY_ERROR:
            return rc
        new_row = self.dbm.get_lastrowid()
        self.dbm.commit()
        return new_row

    def delete_project(self,project_id:int):
        command = 'DELETE FROM project WHERE project.id = ?'
        self.dbm.execute(command,(project_id,))
        self.dbm.commit()

    def delete_task(self,task_id:int):
        command = 'DELETE FROM task WHERE task.id = ?'
        self.dbm.execute(command,(task_id,))
        self.dbm.commit()

    def delete_team(self,team_id:int):
        command = 'DELETE FROM team WHERE team.id = ?'
        self.dbm.execute(command,(team_id,))
        self.dbm.commit()


    def increase_task_status(self,task_id:int,amount:int):
        self.dbm.execute('SELECT status FROM task WHERE id = ?',(task_id,)) 
        current_status = list(self.dbm.fetchone().values())[0]
        new_status = max(min(current_status + amount,DbManager.KANBAN_STATUS_MAX),DbManager.KANBAN_STATUS_MIN)
        command = 'UPDATE task SET status = ? WHERE id = ?'
        self.dbm.execute(command,(new_status,task_id))
        self.dbm.commit()

    def remove_user_from_team(self,user_id:int,team_id:int):
        command = 'DELETE FROM team_composition WHERE team = ? AND user = ?'
        self.dbm.execute(command,(team_id,user_id))
        self.dbm.commit()


    def delete_user(self,user_id):
        command = 'DELETE FROM account WHERE id = ?'
        self.dbm.execute(command,(user_id,))
        self.dbm.commit()

    def delete_task_team_bind(self,task_id:int,team_id:int | None):
        command = 'DELETE FROM task_team_assignment WHERE task = ?'
        
        if team_id is not None:
            command += ' AND team = ?'
            params = (task_id,team_id)
        else:
            params = (task_id,)

        rc = self.dbm.execute(command,params)
        if rc == ReturnCode.Sql.INTEGRITY_ERROR:
            return rc

        self.dbm.commit()

    def update_task(self,task_id:int,data:dict):
        self.dbm.update('task',{**data,'id':task_id},['id'])
        self.dbm.commit()

    def update_project(self,project_id:int,data:dict):
        self.dbm.update('project',{**data,'id':project_id},['id'])
        self.dbm.commit()

    def update_team(self,team_id:int,data:dict):
        self.dbm.update('team',{**data,'id':team_id},['id'])
        self.dbm.commit()

    def update_user(self,user_id:int,data:dict):
        self.dbm.update('user',{**data,'id':user_id},['id'])
        self.dbm.commit()

    def update_account(self,account_id:int,data:dict):
        self.dbm.update('account',{**data,'id':account_id},['id'])
        self.dbm.commit()