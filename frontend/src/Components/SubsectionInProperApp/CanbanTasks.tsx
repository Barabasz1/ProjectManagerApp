import React, { useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/Components/ui/resizable"
import HeaderCanban from '../Basic/HeaderCanban'
import TaskElement from '../Basic/TaskElement'
import { ScrollArea } from "@/Components/ui/scroll-area"
import { useTeamContext } from '@/Context/TeamsContext'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Calendar } from "@/Components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useTasksContext } from '@/Context/TasksContext'
import { useUserContext } from '@/Context/UserContext'
import { useProjectContext } from '@/Context/ProjectsContext'

const CanbanTasks = () => {

  const {teamData} = useTeamContext()
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [priority, setPriority] = useState(''); 

  const handleOpenCreateDialog = () => {
    setCreateTaskDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateTaskDialogOpen(false);
    setNewTaskName('');
    setNewTaskDescription('');
    setDeadline(undefined);
    setSelectedTeam('');
    setPriority(''); 
  };
const {createTask} = useTasksContext()
const {token} = useUserContext()
const {selectedProjectID}  = useProjectContext()
  const handleCreateTask = () => {
    console.log({
      taskName: newTaskName,
      description: newTaskDescription,
      deadline: deadline,
      team: selectedTeam,
      priority: priority
    });
    createTask(token, selectedProjectID, newTaskName, newTaskDescription, deadline, selectedTeam, priority)

    handleCloseCreateDialog();
  };
  const {taskData1,taskData2,taskData3,taskData4,taskData5} = useTasksContext()
  
  return (
    <>
  
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <HeaderCanban text={"1 - to do"} index={0}/>
        <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            {taskData1 && taskData1.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"2 - designing"} index={1}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            {taskData2 && taskData2.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"3 - coding"} index={2}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            {taskData3 && taskData3.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"4 - in test"} index={3}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            {taskData4 && taskData4.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel>
        <HeaderCanban text={"5 - finished"} index={4}/>
          <ScrollArea className="h-[calc(80%)]">
          <div className='flex flex-col gap-2 p-2'>
            {taskData5 && taskData5.map((task) => (
              <TaskElement key={task.id} task={task} />
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
    <button 
  className="fixed text-5xl bottom-10 right-10 w-20 h-20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center z-20 transition-all duration-400 transform hover:scale-110"
  onClick={handleOpenCreateDialog}
>
  <span className="font-semibold leading-none flex items-center justify-center pb-2">+</span>
</button>

      <Dialog open={createTaskDialogOpen} onClose={handleCloseCreateDialog}>
  <DialogTitle className="bg-indigo-100">
    <div className="flex justify-between items-center">
      <span className="text-indigo-800 font-semibold">Create New Task</span>
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
        <label htmlFor="taskName" className="text-indigo-800 font-medium">
          Task Name
        </label>
        <input
          id="taskName"
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none"
          placeholder="Enter task name"
        />
      </div>
      
      
      <div className="flex flex-col gap-2">
        <label htmlFor="taskDescription" className="text-indigo-800 font-medium">
          Task Description
        </label>
        <textarea
          id="taskDescription"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none resize-none h-24"
          placeholder="Enter task description"
        />
      </div>

      {/* New Priority Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-indigo-800 font-medium">
          Priority (1-5)
        </label>
        <Select value={priority} onValueChange={setPriority}>
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
          selected={deadline}
          onSelect={setDeadline}
          className="border-2 border-indigo-600 rounded-md p-2 text-indigo-950 bg-indigo-100 "
        />
      </div>
      
      
      <div className="flex flex-col gap-2">
        <label className="text-indigo-800 font-medium">
          Assign to Team
        </label>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
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
        onClick={handleCreateTask}
        disabled={!newTaskName.trim() || !newTaskDescription.trim() || !priority || !deadline || !selectedTeam}
        className={`py-2 px-4 rounded-md font-medium text-white transition-all duration-300 mt-4
          ${(newTaskName.trim() && newTaskDescription.trim() && priority && deadline && selectedTeam) 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-indigo-300 cursor-not-allowed'}
        `}
      >
        Create Task
      </button>
    </div>
  </DialogContent>
</Dialog>

</>
  )
}

export default CanbanTasks