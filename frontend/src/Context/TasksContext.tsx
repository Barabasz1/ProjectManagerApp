import React, { createContext, useContext, useState } from 'react';

const TasksContext = createContext(null);

export const TaskDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1, setTaskData1] = useState([]);

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
