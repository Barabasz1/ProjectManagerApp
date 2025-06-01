
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';


const ProperApp = () => {
 

  return (
    <Router>
      <NavigationMenu></NavigationMenu>
      <Routes>
        <Route path='/' element={<div> teams</div>} />
        <Route path='/teams' element={<div> teams</div>} />
        <Route path='/users' element={<div> users</div>} />
        <Route path='/tasks' element={<div> tasks</div>} />
        <Route path='/account' element={<div> account</div>} />
      </Routes>
    </Router>
  );
};

export default ProperApp;