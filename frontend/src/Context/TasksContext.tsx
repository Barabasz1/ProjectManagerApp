import { Table2 } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';

import {get,post,del,patch} from './api_request'

const TasksContext = createContext(null);


export const MyDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1]

  
  const fetchTasksOfProejct = (token,project_id) => {
    return get(`get_tasks_of_project?project_id=${project_id}`,token)
  };
  const fetchTasksOfUser= (token,user_id) => {
    return get(`get_tasks_of_project?user_id=${user_id}`,token)
  };

  const removeTask = (idTask, token) => {
    return del(`delete_task/${idTask}`,token)
  };

  const createTask = (token, idprojekt, nazwa, opis, deadline, idTeam) =>{
    return post(`create_task`,token,{
      project_id:idprojekt,
      task_name:nazwa,
      description:opis,
      deadline:deadline,
      team_id:idTeam
    })
  }
  const editTask = (updatedtask, id) =>{
    //NIEWIEM CZY ID JEST OK?
  }

  const IncreaseStatus = (token, IdTask) =>{
    return patch(`increase_task_status/${IdTask}`,token,{amount:1})
  }
   const DecreaseStatus = (token, IdTask) =>{
    return patch(`increase_task_status/${IdTask}`,token,{amount:-1})
  }


  return (
    <TasksContext.Provider value={{  taskdata, fetchTasks, removeTask,createTask }}>
      {children}
    </TasksContext.Provider>
  );
};


export const UseUserContext = () => useContext(TasksContext);
