import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useTasksContext } from '@/Context/TasksContext';
import { useUserContext } from '@/Context/UserContext';
const TaskElement = ({task}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {IncreaseStatus, DecreaseStatus} = useTasksContext()
    const {token} = useUserContext()
      
  const leftClick = (id) =>{
    DecreaseStatus(token, id)
  }
  
  const rightClick = (id) =>{
     IncreaseStatus(token, id)
  }


  return (
    <>
          <div className='min-h-14  w-[calc(100%-2rem)] mx-4 bg-indigo-600 rounded-2xl hover:bg-indigo-950 hover:text-indigo-200 hover:rounded-4xl transition-all duration-700 flex flex-col '>
      <h1 className='text-center text-indigo-50 text-xl px-2'>  {task.name} </h1>
      <p className='text-center text-indigo-100 pt-2'> deadline: {task.deadline}</p>
      <div className="flex justify-between w-full  px-2 py-2 text-indigo-950">
        {task.status != 1 && <button onClick={()=>leftClick(task.id)} className='bg-indigo-50 hover:cursor-pointer hover:bg-indigo-950 hover:text-indigo-50 px-4 py-2 transition duration-700 rounded-full border'> <GoArrowLeft /> </button> }
        <button  onClick={handleOpen} className='bg-indigo-50 hover:cursor-pointer hover:bg-indigo-950 hover:text-indigo-50  transition duration-700 rounded-full px-4 py-2 border'> Details</button>
        {task.status != 5 &&<button  onClick={()=>rightClick(task.id)} className='bg-indigo-50 hover:cursor-pointer hover:bg-indigo-950 hover:text-indigo-50 px-4 py-2  transition duration-700 rounded-full  border'><GoArrowRight/></button>}
      </div>
    </div>

    <Dialog  open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>{task.name}
           <button 
      onClick={handleClose}
      className="absolute top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300"
    >
      ✕
    </button>
        </DialogTitle>
          <DialogContent>
  <div className="flex flex-col justify-center items-center h-full min-w-[200px] gap-2 text-indigo-950">
    <div className="mb-4 text-left w-full">
      <h3 className="font-medium text-indigo-800">Description:</h3>
      <p>{task.description}</p>
    </div>
    
    <div className="text-left w-full">
      <h3 className="font-medium text-indigo-800">Created on:</h3>
      <p>{task.creation_date}</p>
    </div>
  </div>
</DialogContent>
                </Dialog>
    </>
  )
}
export default TaskElement