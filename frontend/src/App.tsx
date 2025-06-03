
import {  useContext,useEffect} from 'react';
import {UserContext} from './Context/UserContext'
import './App.css';
import Footer from './Components/Basic/Footer';
import StartingPage from './Components/StartingPage/StartingPage';
import ProperApp from './Components/ProperApp/ProperApp';


// do usuniecia====================================
import { fetchFromApi } from './utils';
//===================================================

async function fetchToken(username: string, password: string) {
  const response = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) throw new Error("Login failed");
  return await response.json(); // { access_token: ..., token_type: ... }
}

function App() {

  const userContext = useContext(UserContext);
  if (!userContext) {
  return <div>Błąd: brak UserProvider w drzewie komponentów</div>;
  }
  const { user } = userContext;

  // do usuniecia=======================================

    useEffect(() => {
    const testApi = async () => {
      try {
        const hello = await fetch("http://localhost:8000/hello_world");
        const helloData = await hello.json();
        console.log("Message:", helloData.message);

        const token = await fetchToken("Chlebek", "password");
        console.log("Access Token:", token.access_token);
      } catch (error) {
        console.error("Error during test fetch:", error);
      }
    };

    testApi();
  }, []);
  // ===================================================



  return (
    <>
    <div className="flex flex-col min-h-screen bg-[var(--c3)]">
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
