import {useState} from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import UserElement from './UserElement';
import { useUsersContext } from '@/Context/UsersContext';
import { useTeamContext } from '@/Context/TeamsContext';
import { useUserContext } from '@/Context/UserContext';
import { FiEdit } from 'react-icons/fi'; 

const TeamsElement = ({name, id}) => {
    const [open, setOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedTeamName, setEditedTeamName] = useState(name);
    
    const [addSearchTerm, setAddSearchTerm] = useState('');
    const [removeSearchTerm, setRemoveSearchTerm] = useState('');
    const {usersInNotProject,usersInProject, fetchteammembers, fetchnotteammembers, AssignUserToTeam, UnassignUserToTeam, updateTeam } = useTeamContext()
    const {token} = useUserContext()
    const {removeTeam} = useTeamContext()
    
    const handleOpen = (idproj) => {
      setOpen(true)
      
      fetchteammembers(token, idproj)
      fetchnotteammembers(token, idproj)
    };
    const handleClose = () => setOpen(false);
   
    const handleOpenEditDialog = () => {
      setEditedTeamName(name);
      setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
      setEditDialogOpen(false);
    };

    const handleUpdateTeam = () => {
      if (editedTeamName.trim()) {
        updateTeam(id, editedTeamName, token);
        handleCloseEditDialog();
      }
    };
  
    const filteredUsersToAdd = usersInNotProject
        .filter(user => user[1].toLowerCase().includes(addSearchTerm.toLowerCase()));
    
    const filteredUsersToRemove = usersInProject
        .filter(user => user[1].toLowerCase().includes(removeSearchTerm.toLowerCase()));

    return (
        <>
        <div className='flex bg-indigo-950 hover:cursor-pointer w-90 text-3xl  text-indigo-300  h-40 min-h-16 max-h-48 rounded-2xl transition-all hover:rounded-4xl duration-700'>
        <button onClick={()=> handleOpen(id)} className='bg-indigo-700 hover:cursor-pointer hover:bg-indigo-500 max-w-104 min-w-72 w-80 text-3xl hover:text-5xl text-indigo-300 hover:text-indigo-950 h-40 min-h-16 max-h-48 rounded-2xl transition-all hover:rounded-4xl duration-700'>
            {name}
        </button>
        <div className='flex flex-col gap-2 items-center justify-center w-full'>
            <button onClick={()=> removeTeam(id, token)} className='bg-red-600 hover:bg-red-400 rounded-full w-10 h-10 font-bold text-indigo-50 hover:cursor-pointer duration-500'>X</button>
            <button onClick={handleOpenEditDialog} className='bg-indigo-600 hover:bg-indigo-800 rounded-full w-10 h-10 flex items-center justify-center hover:cursor-pointer duration-500'><FiEdit className='w-7'/></button>
        </div>
        
        </div>

     
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
          <DialogTitle className="bg-indigo-100">
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-semibold">Edit Team</span>
              <button 
                onClick={handleCloseEditDialog}
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
                  value={editedTeamName}
                  onChange={(e) => setEditedTeamName(e.target.value)}
                  className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none"
                  placeholder="Enter team name"
                />
              </div>
              
              <button
                onClick={handleUpdateTeam}
                disabled={!editedTeamName.trim()}
                className={`py-2 px-4 rounded-md font-medium text-white transition-all duration-300 mt-4
                  ${editedTeamName.trim() 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-indigo-300 cursor-not-allowed'}
                `}
              >
                Update Team
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog fullScreen fullWidth maxWidth="lg" open={open} onClose={handleClose}>
            <DialogTitle color='textSecondary'>
             
                <button 
                    onClick={handleClose}
                    className="absolute text-2xl top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-300"
                >
                    ✕
                </button>
            </DialogTitle>
            <DialogContent>
                <div className="flex justify-center items-center h-full gap-4 text-indigo-950">
                    <div className='w-1/2 h-full flex flex-col gap-4'>
                        <h1 className="text-2xl font-bold text-indigo-800 mb-2 border-b-2 border-indigo-300 pb-2">
                            Add to <span className="text-indigo-600">{name}</span>
                        </h1>
                        
                        <div className="relative">
                            <input 
                                value={addSearchTerm}
                                onChange={(e) => setAddSearchTerm(e.target.value)}
                                className="w-full bg-white border-2 border-indigo-400 focus:border-indigo-600 rounded-lg py-2 px-4 text-indigo-900 placeholder-indigo-300 outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                                placeholder="Search users to add..."
                                type="text"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className='w-full h-full p-4 rounded-2xl bg-indigo-50/50 shadow-inner flex gap-4 flex-wrap overflow-y-auto'>
                            {filteredUsersToAdd.map(user => (
                                <UserElement 
                                    key={user[0]} 
                                    id={user[0]} 
                                    name={user[1]} 
                                    func={() =>AssignUserToTeam(id, user[0], "rola", token)} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className='w-1 h-full bg-indigo-800'></div>

                    <div className='w-1/2 h-full flex flex-col gap-4'>
                        <h1 className="text-2xl font-bold text-red-600 mb-2 border-b-2 border-indigo-300 pb-2">
                            Delete from <span className="text-red-800">{name}</span>
                        </h1>
                        
                        <div className="relative">
                            <input 
                                value={removeSearchTerm}
                                onChange={(e) => setRemoveSearchTerm(e.target.value)}
                                className="w-full bg-white border-2 border-indigo-400 focus:border-indigo-600 rounded-lg py-2 px-4 text-indigo-900 placeholder-indigo-300 outline-none transition-all duration-300 shadow-sm focus:shadow-md"
                                placeholder="Search users to remove..."
                                type="text"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        
                        <div className='w-full h-full p-4 rounded-2xl bg-indigo-50/50 shadow-inner flex gap-4 flex-wrap overflow-y-auto'>
                            {filteredUsersToRemove.map(user => (
                                <UserElement 
                                    key={user[0]} 
                                    id={user[0]} 
                                    name={user[1]} 
                                    func={() => UnassignUserToTeam(id, user[0], token)} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default TeamsElement