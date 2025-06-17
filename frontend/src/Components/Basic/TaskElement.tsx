import {useState} from 'react'
import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useTasksContext } from '@/Context/TasksContext';
import { useUserContext } from '@/Context/UserContext';
import { Calendar } from "@/Components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useTeamContext } from '@/Context/TeamsContext';
import { FiEdit } from 'react-icons/fi'; 

const TaskElement = ({task, isVisible=true}) => {
    
    const isDeadlinePast = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const deadlineDate = new Date(task.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      
      return deadlineDate < today;
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
   
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [editDeadline, setEditDeadline] = useState<Date | undefined>(undefined);
    const [editSelectedTeam, setEditSelectedTeam] = useState('');
    const [editPriority, setEditPriority] = useState('');

    const {IncreaseStatus, DecreaseStatus, removeTask, editTask} = useTasksContext()
    const {token} = useUserContext()
    const {teamData} = useTeamContext()
    const tab =["1 - Low Priority",
                "2 - Medium-Low Priority",
                "3 - Medium Priority",
                "4 - Medium-High Priority",
                "5 - High Priority"]
 
    const handleOpenEditDialog = () => {
      setEditTaskName(task.name);
      setEditTaskDescription(task.description);
      
     
    
      setEditDialogOpen(true);
    };
    
   
    const handleCloseEditDialog = () => {
      setEditDialogOpen(false);
    };
    
    
    const handleSaveEdit = () => {
      editTask(
        token, 
        task.id, 
        editTaskName, 
        editTaskDescription, 
        editDeadline, 
        editSelectedTeam, 
        editPriority
      );
      handleCloseEditDialog();
    };
      
  const leftClick = (id) =>{
    DecreaseStatus(token, id)
  }
  
  const rightClick = (id) =>{
     IncreaseStatus(token, id)
  }
  
  const deleteTask = (id) => {
    removeTask(token, id)
  }

  return (
    <>
  
      <div className={`min-h-14 max-h-38 max-w-90 relative w-[calc(100%-2rem)] mx-4 ${isDeadlinePast() ? 'bg-red-600 hover:bg-red-950' : 'bg-indigo-600 hover:bg-indigo-950'} rounded-2xl  hover:text-indigo-200 hover:rounded-4xl transition-all duration-700 flex flex-col`}>
        
        {isVisible && <>
        <button 
          onClick={() => handleOpenEditDialog()}
          className={`absolute top-3 left-3 hover:cursor-pointer  ${isDeadlinePast() ? 'bg-red-800 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-950'} text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300 z-10`}
        >
          <FiEdit className="w-4 h-4" />
        </button>
        

        <button 
          onClick={() => deleteTask(task.id)}
          className="absolute text-xl font-bold top-3 right-3 hover:cursor-pointer bg-red-700 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300 z-10"
        >
          X
        </button>
        </>
        }
        <h1 className='text-center text-indigo-50 text-xl px-2'>  {task.name} </h1>
        <p className='text-center text-indigo-100 pt-2'> deadline: {task.deadline.slice(0, 10)}</p>
        <div className="flex justify-between w-full  px-2 py-2 text-indigo-950">
          {task.status != 0 && isVisible && <button onClick={()=>leftClick(task.id)} className={`bg-indigo-50 hover:cursor-pointer ${isDeadlinePast()? 'hover:bg-red-500' : 'hover:bg-indigo-950'} hover:text-indigo-50 px-4 py-2 transition duration-700 rounded-full border`}> <GoArrowLeft /> </button> }
          <button  onClick={handleOpen} className={`bg-indigo-50 hover:cursor-pointer ${isDeadlinePast()? 'hover:bg-red-500' : 'hover:bg-indigo-950'} hover:text-indigo-50  transition duration-700 rounded-full px-4 py-2 border`}> Details</button>
          {task.status != 4 && isVisible &&<button  onClick={()=>rightClick(task.id)} className={`bg-indigo-50 hover:cursor-pointer ${isDeadlinePast()? 'hover:bg-red-500' : 'hover:bg-indigo-950'} hover:text-indigo-50 px-4 py-2  transition duration-700 rounded-full  border`}><GoArrowRight/></button>}
        </div>
      </div>

     
      <Dialog open={open} onClose={handleClose}>
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
            <div className="mb-4 text-left w-full">
              <h3 className="font-medium text-indigo-800">Priority:</h3>
              <p>{tab[task.priority-1]}</p>
            </div>
            <div className="text-left w-full">
              <h3 className="font-medium text-indigo-800">Created on:</h3>
              <p>{task.creation_date}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

     
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle className="bg-indigo-100">
          <div className="flex justify-between items-center">
            <span className="text-indigo-800 font-semibold">Edit Task</span>
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
              <label htmlFor="editTaskName" className="text-indigo-800 font-medium">
                Task Name
              </label>
              <input
                id="editTaskName"
                type="text"
                value={editTaskName}
                onChange={(e) => setEditTaskName(e.target.value)}
                className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none"
                placeholder="Enter task name"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="editTaskDescription" className="text-indigo-800 font-medium">
                Task Description
              </label>
              <textarea
                id="editTaskDescription"
                value={editTaskDescription}
                onChange={(e) => setEditTaskDescription(e.target.value)}
                className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none resize-none h-24"
                placeholder="Enter task description"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-indigo-800 font-medium">
                Priority (1-5)
              </label>
              <Select value={editPriority} onValueChange={setEditPriority}>
                <SelectTrigger className="border-2 border-indigo-600 rounded-md text-indigo-950 p-2">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent 
                  portalprops={{ 
                    container: document.getElementById('root')
                  }}
                  style={{ zIndex: 1400 }}
                >
                  <SelectItem value="1">1 - Low Priority</SelectItem>
                  <SelectItem value="2">2 - Medium-Low Priority</SelectItem>
                  <SelectItem value="3">3 - Medium Priority</SelectItem>
                  <SelectItem value="4">4 - Medium-High Priority</SelectItem>
                  <SelectItem value="5">5 - High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2 ">
              <label className="text-indigo-800 font-medium">
                Deadline
              </label>
              <Calendar
                mode="single"
                selected={editDeadline}
                onSelect={setEditDeadline}
                className="border-2 border-indigo-600 rounded-md p-2 text-indigo-950 bg-indigo-100 "
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-indigo-800 font-medium">
                Assign to Team
              </label>
              <Select value={editSelectedTeam} onValueChange={setEditSelectedTeam}>
                <SelectTrigger className="border-2 border-indigo-600 rounded-md text-indigo-950 p-2">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent 
                  portalprops={{ 
                    container: document.getElementById('root')
                  }} 
                  style={{ zIndex: 1400 }}
                >
                  {teamData && teamData.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <button
              onClick={handleSaveEdit}
              disabled={!editTaskName.trim() || !editTaskDescription.trim() || !editPriority || !editDeadline || !editSelectedTeam}
              className={`py-2 px-4 rounded-md font-medium text-white transition-all duration-300 mt-4
                ${(editTaskName.trim() && editTaskDescription.trim() && editPriority && editDeadline && editSelectedTeam) 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-300 cursor-not-allowed'}
              `}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default TaskElement