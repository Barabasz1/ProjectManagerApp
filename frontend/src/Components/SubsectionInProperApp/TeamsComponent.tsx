import React from 'react'
import TeamsElement from './TeamsElement'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useTeamContext } from '@/Context/TeamsContext'
import TaskElement from '../Basic/TaskElement'

const TeamsComponent = () => {
  const {teamData} = useTeamContext()
  return (
    <div className='bg-indigo-200 w-full h-full flex flex-wrap gap-4 py-8 justify-center content-start overflow-auto relative'>
      
      {teamData.map(elem => (
        <TeamsElement 
          key={elem.id} 
          name={elem.name}
        />
      ))}
      
     
      <button 
        className="fixed text-5xl hover:text-5xl bottom-10 right-10 w-20 h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all duration-400 transform hover:scale-110"
        onClick={() => console.log('Add new team')}
      >
        <span className=" font-semibold">+</span>
      </button>
    </div>
  )
}

export default TeamsComponent