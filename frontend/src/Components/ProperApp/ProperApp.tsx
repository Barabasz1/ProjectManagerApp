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



const ProperApp = () => {
 const {fetchTeams} = useTeamContext();
 const {token, idUser } = useUserContext()
 const {selectedProjectID, fetchProjects} = useProjectContext()
 

 useEffect(()=>{
  const loadTeams = async () => {
      const tokenToSend = token; // Get from auth context or storage
      const projectId = selectedProjectID; // Get from props or state
      
      try {
        await fetchTeams(tokenToSend, projectId);
        
      } catch (error) {
        console.error("Failed to load teams:", error);
      }
    };
    
    loadTeams();
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