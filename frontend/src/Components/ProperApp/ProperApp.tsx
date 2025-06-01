
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';


const ProperApp = () => {
 

  return (
    <Router>
      <NavigationMenu></NavigationMenu>

      <div className='flex h-screen w-full flex-col md:flex-row bg-[var(--c6)]'> 
        <div className='md:w-1/8 md:h-full h-44 bg-[var(--c6)] text-center'> 
        <h1 className='text-amber-50'>Projects:</h1>
        </div>
        <div className='md:w-7/8 h-full bg-indigo-100 md:rounded-tl-3xl md:rounded-bl-3xl' ><Routes>
        <Route path='/' element={<div>dasddsad </div>} />
        <Route path='/teams' element={<div> teams</div>} />
        <Route path='/users' element={<div> users</div>} />
        <Route path='/tasks' element={<div> tasks</div>} />
        <Route path='/account' element={<div> account</div>} />
      </Routes></div>
      </div>
      
    </Router>
  );
};

export default ProperApp;