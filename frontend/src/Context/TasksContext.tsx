import React, { createContext, useContext, useState } from 'react';
import {get,post,del,patch} from './api_request'
import { Description } from '@radix-ui/react-dialog';
const TasksContext = createContext(null);
import {formatDate,create_obj_clean_undefined} from './utils'

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

  async function get_tasks_data(token,project_id, user_id,sortBy: null | 'deadline' | 'priority' = null,sortOrder:null |'asc' | 'desc' = null,date_range:[any,any] | null = null){
    let path:string = `get_tasks?project_id=${project_id}&user_id=${user_id}`
    if(sortBy != null){
      path = path.concat(`&sort=${sortBy}`)
      if(sortOrder!=null){
        path = path.concat(`&sort_order=${sortOrder}`)
      }
    }
    if(date_range != null){ 
      path = path.concat(`&date_from=${date_range[0]}&date_to=${date_range[1]}`)
    }
    return await get(path,token)
  }

  function set_task_data(data){
    setTaskData(data)
  }
  function set_task_data_by_status(data){
    setTaskData1(data.filter(item => item.status === 0))
    setTaskData2(data.filter(item => item.status === 1))
    setTaskData3(data.filter(item => item.status === 2))
    setTaskData4(data.filter(item => item.status === 3))
    setTaskData5(data.filter(item => item.status === 4))
  }
  const fetchTasksOfProejct = async (token,project_id, user_id,sortBy: null | 'deadline' | 'priority' = null,sortOrder:null |'asc' | 'desc' = null) => {
    console.log("fetching tasks")
    setUserId(user_id)
    set_ProjectId(project_id)
  
    const data = await get_tasks_data(token,project_id,user_id)
    set_task_data(data)
    set_task_data_by_status(data)
  };
  const fetchTasksDeadlineASC = async (token,project_id, user_id) => {
    console.log("fetchTasksDeadlineASC")  
    const data = await get_tasks_data(token,project_id,user_id,'deadline','asc')
    set_task_data(data)
    set_task_data_by_status(data)
  }
  const fetchTasksDeadlineDES = async (token,project_id, user_id) => {
    console.log("fetchTasksDeadlineDESC")  
    const data = await get_tasks_data(token,project_id,user_id,'deadline','desc')
    set_task_data(data)
    set_task_data_by_status(data)
  }
  const fetchTasksPriorityASC = async (token,project_id, user_id) => {
    console.log("fetchTasksPriorityASC")
    const data = await get_tasks_data(token,project_id,user_id,'priority','asc')
    set_task_data(data)
    set_task_data_by_status(data)
  }
  const fetchTasksPriorityDES = async (token,project_id, user_id) => {
    console.log("fetchTasksPriorityASC")
    const data = await get_tasks_data(token,project_id,user_id,'priority','desc')
    set_task_data(data)
    set_task_data_by_status(data)
  }


  const fetchTasksByDate = async (token,project_id, user_id, DateFrom, DateTo) => {
    console.log("by date")
    console.log(DateFrom)
    console.log(DateTo)
    const data = await get_tasks_data(token,project_id,user_id,'deadline','asc',[DateFrom.toISOString(),DateTo.toISOString()])
    setTaskData(data)
  }

  const removeTask = async (token, idTask) => {
    await del(`delete_task/${idTask}`,token)
    await fetchTasksOfProejct(token, project_id, user_id )
  };


  // idTeam can be null
  const createTask = async (token, idprojekt, nazwa, opis, deadline, idTeam, priority, status = 0) => {
    console.log("tworzenie taska")
    console.log(token)
    console.log(idprojekt)
    console.log(nazwa)
    console.log(opis)
    const goodFormatDeadline = formatDate(deadline)
    console.log(goodFormatDeadline)
    console.log(idTeam)
    console.log(priority)

    await post(`create_task`,token,{
      project_id:idprojekt,
      name:nazwa,
      description:opis,
      deadline: goodFormatDeadline,
      priority:priority,
      status:status,
      team_id:idTeam,
    })

    await fetchTasksOfProejct(token, idprojekt, user_id )
  };

  // if you dont want to change something, set it to undefined !!!
  const editTask = async (token, idTask, nazwa, opis, deadline, idTeam, priority) => {

    await patch(`edit_task/${idTask}`,token,create_obj_clean_undefined({
        name:nazwa,
        description:opis,
        deadline:formatDate(deadline),
        priority:priority
    }))

    await post(`task_team_bind/${idTask}?bind_mode=unassign_all`,token,null)
    await post(`task_team_bind/${idTask}?team_id=${idTeam}&?bind_mode=assign`,token,null)

    await fetchTasksOfProejct(token, project_id, user_id )

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
    <TasksContext.Provider value={{fetchTasksByDate, fetchTasksDeadlineASC, fetchTasksDeadlineDES, fetchTasksPriorityASC, fetchTasksPriorityDES, taskdata, fetchTasksOfProejct, removeTask, createTask, editTask, IncreaseStatus, DecreaseStatus,taskData1,taskData2,taskData3,taskData4,taskData5 }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasksContext = () => useContext(TasksContext);
