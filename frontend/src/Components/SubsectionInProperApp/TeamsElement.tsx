import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import UserElement from './UserElement';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const TeamsElement = ({name}) => {
      const [open, setOpen] = useState(false);
          const handleOpen = () => setOpen(true);
          const handleClose = () => setOpen(false);
  return (
    <>
    <button onClick={handleOpen} className='bg-indigo-700 hover:cursor-pointer hover:bg-indigo-500 max-w-104 min-w-72 w-80 text-3xl hover:text-5xl text-indigo-300 hover:text-indigo-950 h-40 min-h-16 max-h-48 rounded-2xl transition-all hover:rounded-4xl duration-700'>
        {name}
    </button>
      <Dialog  fullScreen  fullWidth  maxWidth="lg" open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>
           <button 
      onClick={handleClose}
      className="absolute text-2xl top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
    >
      ✕
    </button>
        </DialogTitle>
          <DialogContent  >
            <div className="flex justify-center items-center h-full gap-4 text-indigo-950">
               <div className='w-1/2 h-full flex flex-col gap-4'>
    <h1 className="text-2xl font-bold text-indigo-800 mb-2 border-b-2 border-indigo-300 pb-2">
      Add to <span className="text-indigo-600">{name}</span>
    </h1>
    
    <div className="relative">
      <input 
        className="w-full bg-white border-2 border-indigo-400 focus:border-indigo-600 rounded-lg py-2 px-4 text-indigo-900 placeholder-indigo-300 outline-none transition-all duration-300 shadow-sm focus:shadow-md"
        placeholder="Search users..."
        type="text"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    
    <div className='w-full h-full p-4 rounded-2xl bg-indigo-50/50 shadow-inner flex gap-4 flex-wrap overflow-y-auto'>
     
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      
    </div>
  </div>
              
              <div className='w-1 h-full bg-indigo-800'></div>

               <div className='w-1/2 h-full flex flex-col gap-4'>
    <h1 className="text-2xl font-bold text-red-600 mb-2 border-b-2 border-indigo-300 pb-2">
      Delete from <span className="text-red-800">{name}</span>
    </h1>
    
    <div className="relative">
      <input 
        className="w-full bg-white border-2 border-indigo-400 focus:border-indigo-600 rounded-lg py-2 px-4 text-indigo-900 placeholder-indigo-300 outline-none transition-all duration-300 shadow-sm focus:shadow-md"
        placeholder="Search users..."
        type="text"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    
    <div className='w-full h-full p-4 rounded-2xl bg-indigo-50/50 shadow-inner flex gap-4 flex-wrap overflow-y-auto'>
     
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
        <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      <UserElement func={() => console.log("dasd")} />
      
    </div>
  </div>
            </div>
          </DialogContent>
                </Dialog>
    </>
  )
}

export default TeamsElement