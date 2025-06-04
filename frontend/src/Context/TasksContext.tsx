import React, { createContext, useContext, useState } from 'react';


const TasksContext = createContext(null);


export const MyDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);

  
  const fetchTasks = (iduser) => {
    //podajesz id i dostaje wszystkie taski ze statusami
  };

  
  const removeTask = (idTask) => {
    //podajesz idtaska i sie usuwa
  };

  const createTask = (newtask) =>{
    //NIE WIEM jak zrobic przydzielanie i jakie jeszcze argumenty
  }
  const editTask = (updatedtask, id) =>{
    //NIEWIEM CZY ID JEST OK?
  }

  return (
    <TasksContext.Provider value={{  taskdata, fetchTasks, removeTask,createTask }}>
      {children}
    </TasksContext.Provider>
  );
};


export const UseUserContext = () => useContext(TasksContext);
