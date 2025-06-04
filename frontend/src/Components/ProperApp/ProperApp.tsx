import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import CanbanTasks from '../SubsectionInProperApp/CanbanTasks';

import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../Basic/app-sidebar';
import TeamsComponent from '../SubsectionInProperApp/TeamsComponent';
import UserComponent from '../SubsectionInProperApp/UserComponent';



const ProperApp = () => {
 

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
                <Route path='/' element={<div>dasddsad </div>} />
                <Route path='/teams' element={<TeamsComponent></TeamsComponent>} />
                <Route path='/users' element={<UserComponent></UserComponent>} />
                <Route path='/tasks' element={<CanbanTasks></CanbanTasks>} />
                {1==2 && <Route path='/account' element={<div> account</div>} />}
              </Routes>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </Router>
  );
};

export default ProperApp;