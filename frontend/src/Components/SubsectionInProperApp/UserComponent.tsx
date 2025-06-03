import React from 'react'

import { ScrollArea } from '@radix-ui/react-scroll-area'
import UserElement from './UserElement'

const UserComponent = () => {
  return (
    <div className='bg-indigo-200 w-full h-full flex flex-wrap gap-4 py-16 content-start justify-center overflow-auto'>
        
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
    <UserElement/>
       
      
  
    </div>
  )
}

export default UserComponent