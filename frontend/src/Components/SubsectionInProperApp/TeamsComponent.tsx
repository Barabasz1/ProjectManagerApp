import React, { useState } from 'react'
import TeamsElement from './TeamsElement'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { useTeamContext } from '@/Context/TeamsContext'
import TaskElement from '../Basic/TaskElement'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useProjectContext } from '@/Context/ProjectsContext'
import { useUserContext } from '@/Context/UserContext'

const TeamsComponent = () => {
  const { teamData } = useTeamContext()
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  const handleOpenCreateDialog = () => {
    setCreateTeamDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateTeamDialogOpen(false);
    setNewTeamName('');
  };
const {createTeam} = useTeamContext()
const {token} = useUserContext()
const {selectedProjectID} = useProjectContext()
  const handleCreateTeam = () => {
    createTeam(token, newTeamName,selectedProjectID)
    
    handleCloseCreateDialog();
  };

  return (
    <div className='bg-indigo-200 w-full h-full flex flex-wrap gap-4 py-8 justify-center content-start overflow-auto relative'>
      
      {teamData.map(elem => (
        <TeamsElement 
          key={elem.id} 
          name={elem.name}
          id={elem.id} 
        />
      ))}
      
      <button 
        className="fixed text-5xl bottom-10 right-10 w-20 h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all duration-400 transform hover:scale-110"
        onClick={handleOpenCreateDialog}
      >
        <span className="font-semibold leading-none flex items-center justify-center pb-2">+</span>
      </button>

      <Dialog open={createTeamDialogOpen} onClose={handleCloseCreateDialog}>
        <DialogTitle className="bg-indigo-100">
          <div className="flex justify-between items-center">
            <span className="text-indigo-800 font-semibold">Create Team</span>
            <button 
              onClick={handleCloseCreateDialog}
              className="bg-red-800 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300"
            >
              ✕
            </button>
          </div>
        </DialogTitle>
        <DialogContent className="pt-4">
          <div className="flex flex-col gap-4 p-2 min-w-[300px]">
            <div className="flex flex-col gap-2">
              <label htmlFor="teamName" className="text-indigo-800 font-medium">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none"
                placeholder="Enter team name"
              />
            </div>
            
            <button
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
              className={`py-2 px-4 rounded-md font-medium text-white transition-all duration-300 mt-4
                ${newTeamName.trim() 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-300 cursor-not-allowed'}
              `}
            >
              Create Team
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TeamsComponent