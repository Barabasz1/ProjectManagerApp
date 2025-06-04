
import {  useContext,useEffect} from 'react';
import {UserContext} from './Context/UserContext'
import './App.css';
import Footer from './Components/Basic/Footer';
import StartingPage from './Components/StartingPage/StartingPage';
import ProperApp from './Components/ProperApp/ProperApp';


// do usuniecia====================================
import { authorize_main_test} from './test';
//===================================================


function App() {

  const userContext = useContext(UserContext);
  if (!userContext) {
  return <div>Błąd: brak UserProvider w drzewie komponentów</div>;
  }
  const { user } = userContext;

  // do usuniecia=======================================
  authorize_main_test()

  // ===================================================



  return (
    <>
    <div className="flex flex-col h-screen bg-[var(--c3)] overflow-hidden">
      <main className='flex-grow'>
        {user==-1 &&<StartingPage></StartingPage>}
        {user!= -1 && <ProperApp></ProperApp> }
        
        </main>
        <Footer></Footer>
    </div>
  
    </>
  );
}


export default App;
