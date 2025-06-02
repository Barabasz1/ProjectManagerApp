import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
const TaskElement = () => {

    const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      
  const leftClick = () =>{
    console.log("left clicked")
  }
  
  const rightClick = () =>{
    console.log("right clicked")
  }


  return (
    <>
          <div className='min-h-14  w-[calc(100%-2rem)] mx-4 bg-indigo-600 rounded-2xl hover:bg-indigo-950 hover:text-indigo-200 hover:rounded-4xl transition-all duration-700 flex flex-col '>
      <h1 className='text-center text-indigo-50 text-xl px-2'>  Twoim zadaniem jest zrobienie Frontendu </h1>
      <p className='text-center text-indigo-100 pt-2'> deadline: 10.06.2025</p>
      <div className="flex justify-between w-full  px-2 py-2 text-indigo-950">
        <button onClick={leftClick} className='bg-indigo-50 hover:bg-indigo-950 hover:text-indigo-50 px-4 py-2 transition duration-700 rounded-full border'> <GoArrowLeft /> </button>
        <button  onClick={handleOpen} className='bg-indigo-50 hover:bg-indigo-950 hover:text-indigo-50  transition duration-700 rounded-full px-4 py-2 border'> Details</button>
        <button  onClick={rightClick} className='bg-indigo-50 hover:bg-indigo-950 hover:text-indigo-50 px-4 py-2  transition duration-700 rounded-full  border'><GoArrowRight/></button>
      </div>
    </div>

    <Dialog  open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>TITLE TASK
           <button 
      onClick={handleClose}
      className="absolute top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300"
    >
      ✕
    </button>
        </DialogTitle>
          <DialogContent >
            <div className="flex flex-col justify-center items-center h-full min-w-[200px] gap-2 text-indigo-950">
  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam voluptatem eveniet cupiditate aut magnam nisi impedit similique! A provident recusandae officiis reiciendis omnis esse natus, tempora, voluptas culpa dignissimos incidunt.
</div>
          </DialogContent>
                </Dialog>
    </>
  )
}
export default TaskElement