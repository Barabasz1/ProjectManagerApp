import { Box, Button} from '@mui/material';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import { UserContext, useUserContext } from '../../Context/UserContext';

const NavigationMenu = ({ children }: { children: React.ReactNode }) => {
     
      const { user, setUser, logOut } = useUserContext();
      

  return (
    <Box className="bg-indigo-950 p-4 text-center flex flex-wrap">
      {children}
      <Box 
        className="flex justify-center items-center gap-4 mt-4"
        sx={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px'
        }}
      >
        
        
         <Button
          component={Link}
          to="/teams"
          variant="contained"
          color="primary"
          sx={{ 
            flex: 1,
            fontWeight: 'bold',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s'
          }}
        >
          teams
        </Button>


        <Button
          component={Link}
          to="/tasks"
          variant="contained"
          color="primary"
          sx={{ 
            flex: 1,
            fontWeight: 'bold',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s'
          }}
        >
          tasks
        </Button>
         
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="error"
          
          sx={{ 
            marginLeft: 'auto',
            fontWeight: 'bold',
            '&:hover': { transform: 'translateY(-2px)' },
            transition: 'transform 0.2s'
          }}
          onClick={() =>{setUser(-1)}}
        >
          Log out
        </Button>
      
      </Box>
      
     
    </Box>
  );
};

export default NavigationMenu;