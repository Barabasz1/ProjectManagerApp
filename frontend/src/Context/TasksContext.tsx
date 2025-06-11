import React, { createContext, useContext, useState } from 'react';
import {get,post,del,patch} from './api_request'
const TasksContext = createContext(null);

export const TaskDataProvider = ({ children }) => {
  const [taskdata, setTaskData] = useState([]);
  const [taskData1, setTaskData1] = useState([]);
  const [taskData2, setTaskData2] = useState([]);
  const [taskData3, setTaskData3] = useState([]);
  const [taskData4, setTaskData4] = useState([]);
  const [taskData5, setTaskData5] = useState([]);
  //private
  const [user_id, setUserId] = useState(null)
  const [project_id, set_ProjectId] = useState(null)


  const fetchTasksOfProejct = async (token,project_id, user_id) => {
    console.log("fetching tasks")
    setUserId(user_id)
    set_ProjectId(project_id)
    const data = await get(`get_tasks?project_id=${project_id}&user_id=${user_id}`,token)

    
    const data1 = data.filter(item => item.status === 0);
const data2 = data.filter(item => item.status === 1);
const data3 = data.filter(item => item.status === 2);
const data4 = data.filter(item => item.status === 3);
const data5 = data.filter(item => item.status === 4);
console.log(data)
setTaskData1(data1)
setTaskData2(data2)
setTaskData3(data3)
setTaskData4(data4)
setTaskData5(data5)



  };

  const removeTask = async (token, idTask) => {
    await del(`delete_task/${idTask}`,token)
    await fetchTasksOfProejct(token, project_id, user_id )
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  const createTask = async (token, idprojekt, nazwa, opis, deadline, idTeam, priority) => {
    console.log("tworzenie taska")
    console.log(token)
    console.log(idprojekt)
    console.log(nazwa)
    console.log(opis)
    const goodFormatDeadline = formatDate(deadline)
    console.log(goodFormatDeadline)
    console.log(idTeam)
    console.log(priority)
    // await post(`create_task`,token,{
    //   project_id:idprojekt,
    //   name:nazwa,
    //   description:opis,
    //   deadline:deadline,
    //   team_id:idTeam
    // })
 console.log("DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY DO POPRAWY DODAWANIA TASKOW _ DODAJ PRIORITY")
    await post(`create_task`,token,{
      project_id:idprojekt,
      name:nazwa,
      description:opis,
      deadline: goodFormatDeadline,
      team_id:idTeam
    })

    await fetchTasksOfProejct(token, idprojekt, user_id )
  };

  const editTask = (token, idprojekt, nazwa, opis, deadline, idTeam, priority) => {
    console.log("edycja taska")
    console.log(token)
    console.log(idprojekt)
    console.log(nazwa)
    console.log(opis)
    const goodFormatDeadline = formatDate(deadline)
    console.log(goodFormatDeadline)
    console.log(idTeam)
    console.log(priority)
  };

  const IncreaseStatus = async (token, IdTask) => {
    await patch(`increase_task_status/${IdTask}`,token,{amount:1})
    console.log("increase status")
    console.log(IdTask)

    //od nowa fetchuje
  await fetchTasksOfProejct(token, project_id, user_id)

  };

  const DecreaseStatus = async (token, IdTask) => {
    await patch(`increase_task_status/${IdTask}`,token,{amount:-1})
     console.log("decrease status")
     console.log(IdTask)
     //od nowa fetchuje
    await fetchTasksOfProejct(token, project_id, user_id)
  };

  return (
    <TasksContext.Provider value={{ taskdata, fetchTasksOfProejct, removeTask, createTask, editTask, IncreaseStatus, DecreaseStatus,taskData1,taskData2,taskData3,taskData4,taskData5 }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
