import React, { createContext, useContext, useState } from 'react';
import {get,post,del,patch} from './api_request'
const TasksContext = createContext(null);

export const TaskDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1, setTaskData1] = useState([]);

  const fetchTasksOfProejct = (token,project_id) => {
    return get(`get_tasks_of_project?project_id=${project_id}`,token)
  };
  const fetchTasksOfUser= (token,user_id) => {
    return get(`get_tasks_of_project?user_id=${user_id}`,token)
  };

  const removeTask = (idTask, token) => {
    return del(`delete_task/${idTask}`,token)
  };

  const createTask = (token, idprojekt, nazwa, opis, deadline, idTeam) => {
    return post(`create_task`,token,{
      project_id:idprojekt,
      task_name:nazwa,
      description:opis,
      deadline:deadline,
      team_id:idTeam
    })
  };

  const editTask = (updatedtask, id) => {
    // Logika edytowania zadania
  };

  const IncreaseStatus = (token, IdTask) => {
    patch(`increase_task_status/${IdTask}`,token,{amount:1})
    console.log("increase status")
    console.log(IdTask)
  };

  const DecreaseStatus = (token, IdTask) => {
    patch(`increase_task_status/${IdTask}`,token,{amount:-1})
     console.log("decrease status")
     console.log(IdTask)
  };

  return (
    <TasksContext.Provider value={{ taskdata, fetchTasksOfProejct,fetchTasksOfUser, removeTask, createTask, editTask, IncreaseStatus, DecreaseStatus }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
