import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

const UserElement = () => {
      const [open, setOpen] = useState(false);
          const handleOpen = () => setOpen(true);
          const handleClose = () => setOpen(false);
  return (
    <>
    <button onClick={handleOpen} className='hover:cursor-pointer bg-indigo-700 hover:bg-indigo-500 max-w-104 min-w-72 w-80 text-2xl hover:text-4xl text-indigo-200 hover:text-white h-40 min-h-16 max-h-48 rounded-xl shadow-lg hover:shadow-xl transition-all hover:rounded-3xl duration-500 flex items-center justify-center gap-3'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:h-10 group-hover:w-10 transition-all" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
    <span>USERNAME</span>
</button>
      <Dialog  open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>USERNAME
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

export default UserElement