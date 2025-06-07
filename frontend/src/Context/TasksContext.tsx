import React, { createContext, useContext, useState } from 'react';

<<<<<<< HEAD
import {get,post,del,patch} from './api_request'

=======
>>>>>>> Frontend
const TasksContext = createContext(null);

export const TaskDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1, setTaskData1] = useState([]);

<<<<<<< HEAD
  
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
=======
  const fetchTasks = (token) => {
    // Logika pobierania zadań (np. zapytanie do API)
  };

  const removeTask = (idTask, token) => {
    // Logika usuwania zadania
  };

  const createTask = (token, idprojekt, nazwa, opis, deadline, idTeam) => {
    // Logika tworzenia zadania (przydzielanie, itp.)
  };

  const editTask = (updatedtask, id) => {
    // Logika edytowania zadania
  };

  const IncreaseStatus = (token, IdTask) => {
    // Logika zwiększania statusu zadania
    console.log("increase status")
    console.log(IdTask)
  };
>>>>>>> Frontend

  const DecreaseStatus = (token, IdTask) => {
    // Logika zmniejszania statusu zadania
     console.log("decrease status")
     console.log(IdTask)
  };

  return (
    <TasksContext.Provider value={{ taskdata, fetchTasks, removeTask, createTask, editTask, IncreaseStatus, DecreaseStatus }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
