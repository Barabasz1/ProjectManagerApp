
import { useState , useContext} from 'react';

import { Box, Typography, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import  Image from '../../assets/logo.png'
import { UserContext } from '../../Context/UserContext';
import LoginPanel from './LoginPanel';
import RegisterPanel from './RegisterPanel';
import { useUserContext } from '@/Context/UserContext';
const Top = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [registerOpen, setRegisterOpen] = useState(false)
    const handleOpenRegister = () =>{
      setRegisterOpen(true)
    }
    const handleCloseRegister = () =>{
      setRegisterOpen(false)
    }


    const userContext = useContext(UserContext);
    if (!userContext) {
    return <div>Błąd: brak UserProvider w drzewie komponentów</div>;
    }
    const {  setUser } = userContext;


  return (
    <>
    <Box className="bg-gradient-to-b from-[var(--c6)] to-[var(--c5)]  p-12 text-center items-center flex flex-col gap-4">
          
         
          
          <Typography variant="h3" className="text-white">
            Task Manager
          </Typography>
           <img src={Image} className="h-16  filter brightness-0 invert" />

        
      
        <div className='flex gap-4'>
          <button className="bg-[var(--c6)] hover:bg-[var(--c5)] text-white font-medium py-2 px-4 w-32 h-12 rounded-lg shadow transition duration-500 ease-in-out" onClick={handleOpen}> LOGIN</button>
         <button className="bg-[var(--c6)] hover:bg-[var(--c5)] text-white font-medium py-2 px-4 w-32 h-12 rounded-lg shadow transition duration-500 ease-in-out " onClick={handleOpenRegister}> REGISTER</button>
        </div>
        
      </Box>
     
      <Dialog  open={open} onClose={handleClose}>
        <DialogTitle color='textSecondary'>

          <button 
      onClick={handleClose}
      className="absolute top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300"
    >
      ✕
    </button>
        </DialogTitle>
        <DialogContent >
         <LoginPanel>

         </LoginPanel>
         {/*<Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            minWidth={200}
            gap={2}
          >
          
            <Button
              variant="contained"
              color="secondary"
              onClick={()=>{
                loginUser("Chlebek", "password")
              
              }}
              className="mt-4"
              fullWidth
            >
              Login as User1
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={()=>{setUser(2)}}
              className="mt-4"
              fullWidth
            >
              Login as User2
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={()=>{setUser(0)}}
              className="mt-4"
              fullWidth
            >
              Login As Admin
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleClose}
              className="mt-4"
              fullWidth
            >
              Exit
            </Button> 
          </Box>  */}
        </DialogContent>
      </Dialog>


      
      <Dialog  open={registerOpen} onClose={handleCloseRegister}>
        <DialogTitle color='textSecondary'>

          <button 
      onClick={handleCloseRegister}
      className="absolute top-1 right-2 bg-red-800 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-300"
    >
      ✕
    </button>
        </DialogTitle>
        <DialogContent >
        <RegisterPanel>

        </RegisterPanel>
        
              
        </DialogContent>
      </Dialog>
        


    </>
  )
}

export default Top