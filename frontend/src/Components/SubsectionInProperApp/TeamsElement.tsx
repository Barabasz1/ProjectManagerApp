import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

const TeamsElement = ({name}) => {
      const [open, setOpen] = useState(false);
          const handleOpen = () => setOpen(true);
          const handleClose = () => setOpen(false);
  return (
    <>
    <button onClick={handleOpen} className='bg-indigo-700 hover:cursor-pointer hover:bg-indigo-500 max-w-104 min-w-72 w-80 text-3xl hover:text-5xl text-indigo-300 hover:text-indigo-950 h-40 min-h-16 max-h-48 rounded-2xl transition-all hover:rounded-4xl duration-700'>
        {name}
    </button>
      <Dialog  open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>{name}
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

export default TeamsElement