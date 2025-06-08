import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar"
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useProjectContext } from '@/Context/ProjectsContext';
import { useUserContext } from '@/Context/UserContext';



export function AppSidebar() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const {projectData, SetSelectedProjectID, removeProjects, createProjects} = useProjectContext()
  const {token} = useUserContext()
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewProjectName('');
  };
  
  const handleCreateProject = () => {
    console.log("Creating new project:", newProjectName);
    
    createProjects(token, newProjectName, "opis temp")
  };

  return (
    <>
    <Sidebar variant="sidebar" >
      <SidebarContent>
        <SidebarHeader className="shadow-xl to-indigo-300 text-3xl font-bold">Projects:</SidebarHeader>
       
           <SidebarMenu>
  {projectData.map((project) => (
    <SidebarMenuItem key={project.id}>
      <SidebarMenuButton asChild>
        <div className="flex justify-between items-center w-full pr-3">
          <button 
            onClick={() => {
              
              SetSelectedProjectID(project.id);
            }} 
            className="text-left hover:text-indigo-700 hover:font-medium flex-grow py-1"
          >
            {project.name}
          </button>
          <button 
            onClick={() => {
              removeProjects(project.id, token)
            }} 
            className="bg-red-700 border-red-700 border-8 hover:bg-red-400 hover:border-red-400 hover:cursor-pointer text-white rounded-full w-7 h-7 flex items-center justify-center text-xl"
          >
            X
          </button>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
  <div className="w-full flex justify-center items-center">
    <button 
      onClick={handleOpenCreateDialog}
      className="bg-indigo-700 mt-4 text-indigo-50 text-4xl pb-2 hover:cursor-pointer rounded-full hover:bg-indigo-500 hover:scale-110 duration-700 font-bold w-16 h-16"
    >
      +
    </button>
  </div>
</SidebarMenu>
        
      </SidebarContent>
   
    </Sidebar>

   
    <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog}>
      <DialogTitle className="bg-indigo-100">
        <div className="flex justify-between items-center">
          <span className="text-indigo-800 font-semibold">Create Project</span>
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
            <label htmlFor="projectName" className="text-indigo-800 font-medium">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border-2 border-indigo-600 text-indigo-600 focus:border-indigo-500 rounded-md p-2 outline-none"
              placeholder="Enter project name"
            />
          </div>
          
          <button
            onClick={handleCreateProject}
            disabled={!newProjectName.trim()}
            className={`py-2 px-4 rounded-md font-medium text-white transition-all duration-300 mt-4
              ${newProjectName.trim() 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-indigo-300 cursor-not-allowed'}
            `}
          >
            Create Project
          </button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}