import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';

const UserElement = ({func}) => {
      
  return (
    <>
    <button onClick={func} className='hover:cursor-pointer bg-indigo-700 hover:50 pl-4 pr-6  py-4 max-w-50 min-w-30   min-h-8 max-h-48 text-2xl hover:text-4xl text-indigo-200 hover:text-white  rounded-xl shadow-lg hover:shadow-xl transition-all hover:rounded-3xl duration-500 flex items-center justify-center gap-3'>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 group-hover:h-10 group-hover:w-10 transition-all" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
    <span>USERNAME</span>
</button>

    </>
  )
}

export default UserElement