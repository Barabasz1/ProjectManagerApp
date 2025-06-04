
import {  useContext} from 'react';
import {UserContext} from './Context/UserContext'
import './App.css';
import Footer from './Components/Basic/Footer';
import StartingPage from './Components/StartingPage/StartingPage';
import ProperApp from './Components/ProperApp/ProperApp';
import { TaskDataProvider } from './Context/TasksContext';
import { ProjectDataProvider } from './Context/ProjectsContext';
import { TeamDataProvider } from './Context/TeamsContext';
import { UserDataProvider } from './Context/UsersContext';





function App() {

  const userContext = useContext(UserContext);
  if (!userContext) {
  return <div>Błąd: brak UserProvider w drzewie komponentów</div>;
  }
  const { user } = userContext;

  return (
    <>
    <div className="flex flex-col h-screen bg-[var(--c3)] overflow-hidden">
      <main className='flex-grow'>
        {user==-1 &&<StartingPage></StartingPage>}
        <TaskDataProvider>
          <ProjectDataProvider>
            <TeamDataProvider>
              <UserDataProvider>
                {user!= -1 && <ProperApp></ProperApp> }   

              </UserDataProvider>
            </TeamDataProvider>
          </ProjectDataProvider>
            
        </TaskDataProvider>
        
        
        </main>
        <Footer></Footer>
    </div>
  
    </>
  );
}

export default App;
