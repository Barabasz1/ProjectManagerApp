import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import CanbanTasks from '../SubsectionInProperApp/CanbanTasks';

import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../Basic/app-sidebar';
import TeamsComponent from '../SubsectionInProperApp/TeamsComponent';
import UserComponent from '../SubsectionInProperApp/UserComponent';
import { useTeamContext } from '@/Context/TeamsContext';
import { use, useEffect } from 'react';
import { useUserContext } from '@/Context/UserContext';
import { useProjectContext } from '@/Context/ProjectsContext';
import { useTasksContext } from '@/Context/TasksContext';
import { useUsersContext } from '@/Context/UsersContext';



const ProperApp = () => {
 const {fetchTeams, usersInProject, usersInNotProject} = useTeamContext();
 const {token, idUser } = useUserContext()
 const { selectedProjectID, fetchProjects} = useProjectContext()
 const {fetchTasksOfProejct} = useTasksContext()
 const {fetchUsers, } = useUsersContext()
 

 useEffect(()=>{
  const loadTeamsAndTasks = async () => {
      const tokenToSend = token; // Get from auth context or storage
      const projectId = selectedProjectID; // Get from props or state
      const userIDtoSend = idUser
      
      try {
        await fetchTeams(tokenToSend, projectId);
       
        await fetchTasksOfProejct(tokenToSend, projectId, userIDtoSend)
        await fetchUsers()
        
        
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    };
  
    
    loadTeamsAndTasks();
 }, [selectedProjectID])


 
  useEffect(()=>{
  const loadProjects = async () => {
      const tokenToSend = token; 
      const user_id = idUser
      
      try {
        await fetchProjects(tokenToSend, user_id)
        
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    };
    
    loadProjects();
 }, [])

  useEffect(()=>{
  const loadTeamsAndTasks = async () => {
      const tokenToSend = token; 
      const projectId = selectedProjectID; 
      const userIDtoSend = idUser
      
      try {
       console.log("dmadsajd")
       
        await fetchTasksOfProejct(tokenToSend, projectId, userIDtoSend)
      
        
        
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };
  
    
    loadTeamsAndTasks();
 }, [usersInNotProject, usersInProject])
 


  return ( 


    <Router>
      <SidebarProvider>
        
        <AppSidebar />
        
        <main className="flex flex-col w-full h-screen">
          

          <NavigationMenu>
            <SidebarTrigger className="w-10 h-10 m-2 bg-indigo-300">
           
          </SidebarTrigger>
          </NavigationMenu>

          <div className="flex h-screen w-full flex-col md:flex-row bg-[var(--c6)]"> 
            <div className="w-screen h-full bg-indigo-100 md:rounded-tl-3xl md:rounded-bl-3xl">
              <Routes>
              
                <Route path='/' element={<TeamsComponent></TeamsComponent>} />

                <Route path='/tasks' element={<CanbanTasks></CanbanTasks>} />
       
              </Routes>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </Router>
  );
};

export default ProperApp;