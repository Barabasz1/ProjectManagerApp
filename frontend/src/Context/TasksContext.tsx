import { Table2 } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';


const TasksContext = createContext(null);


export const MyDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1]

  
  const fetchTasks = (token) => {
    //podajesz id i dostaje wszystkie taski ze statusami

    tab1
    tab2 
    tab3 
    tab4 
    tab5 
  };

  
  const removeTask = (idTask, token) => {
    //podajesz idtaska i sie usuwa
  };

  const createTask = (token, idprojekt, nazwa, opis, deadline, idTeam) =>{
    //NIE WIEM jak zrobic przydzielanie i jakie jeszcze argumenty
  }
  const editTask = (updatedtask, id) =>{
    //NIEWIEM CZY ID JEST OK?
  }

  const IncreaseStatus = (token, IdTask) =>{

  }
   const DecreaseStatus = (token, IdTask) =>{
    
  }


  return (
    <TasksContext.Provider value={{  taskdata, fetchTasks, removeTask,createTask }}>
      {children}
    </TasksContext.Provider>
  );
};


export const UseUserContext = () => useContext(TasksContext);
