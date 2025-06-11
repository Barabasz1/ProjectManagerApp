import React, { useState } from 'react'
import { Calendar } from "@/Components/ui/calendar";
import { useTasksContext } from '@/Context/TasksContext';
import TaskElement from '../Basic/TaskElement';
const Timeline = () => {
    const {taskdata} = useTasksContext()
    const [datefrom, setdatefrom] = useState(null)
    const [dateto, setdateto] = useState(null)
    
    const ChangeTask =  () => {
        console.log(datefrom)
        console.log(dateto)
      
    }
  return (
     <div className="flex  justify-center items-start h-full  gap-4 text-indigo-950 w-full bg-indigo-300 overflow-auto">
        <div className=' p-7 flex  bg-indigo-400 h-full'>
            <div className='flex gap-3 flex-col text-2xl font-bold text-indigo-950'>
                 <h1> Date from </h1>
          <Calendar
        
          mode="single"
          selected={datefrom}
          onSelect={setdatefrom}
          className="border-2 border-indigo-600 rounded-md p-2 text-indigo-950 bg-indigo-100 "
        />
        <h1> Date to </h1>
        <Calendar
          mode="single"
          selected={dateto}
          onSelect={setdateto}
          className="border-2 border-indigo-600 rounded-md p-2 text-indigo-950 bg-indigo-100 "
        />
            </div>
          
       
        </div> 
        <div className=' h-full flex items-center'>
        <button onClick={ChangeTask} className='bg-indigo-800 w-25 text-indigo-100 text-5xl h-23  px-1 rounded-4xl hover:bg-indigo-600 duration-700 hover:rotate-5 hover:cursor-pointer hover:font-bold'>GET</button>
        </div>
        
        <div className='w-full  h-full flex p-5 gap-5 flex-wrap justify-center content-start overflow-auto relative '>
                {taskdata && taskdata.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}

           
        </div>
    </div>
  )
}

export default Timeline