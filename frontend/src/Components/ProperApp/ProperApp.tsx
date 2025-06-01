import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import CanbanTasks from '../SubsectionInProperApp/CanbanTasks';

import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from '../Basic/app-sidebar';



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
            <div className="md:w-7/8 h-full bg-indigo-100 md:rounded-tl-3xl md:rounded-bl-3xl">
              <Routes>
                <Route path='/' element={<div>dasddsad </div>} />
                <Route path='/teams' element={<div> teams</div>} />
                <Route path='/users' element={<div> users</div>} />
                <Route path='/tasks' element={<CanbanTasks></CanbanTasks>} />
                <Route path='/account' element={<div> account</div>} />
              </Routes>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </Router>
  );
};

export default ProperApp;