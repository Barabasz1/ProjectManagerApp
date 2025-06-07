import React, { useState } from 'react'
import { Box, Typography, Button } from '@mui/material';
import { useUserContext } from '@/Context/UserContext';

const LoginPanel = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {loginUser, error, setError} = useUserContext()

  const login = () => {
   
    try {
      loginUser(username, password)
      
    }
    catch(error){
      console.log("Failed")
    }
  }

  const handleTryAgain = () => {
    setUsername('');
    setPassword('');
    setError(0)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      minWidth={300}
      gap={2}
      className="p-8 rounded-lg bg-indigo-50 shadow-lg"
    >
      <Typography variant="h5" className="text-indigo-800 font-bold mb-6">
        Welcome Back
      </Typography>
      
      <div className="w-full space-y-4">
        
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 
              ${username ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} 
              focus:border-indigo-600 focus:shadow-md text-indigo-950`}
            placeholder="Username"
          />
         
        </div>

        
        <div className="relative">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full text-indigo-950 px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 
              ${password ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} 
              focus:border-indigo-600 focus:shadow-md`}
            placeholder="Password"
          />
         
        </div>

        
         <button 
         
          className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300
            ${username && password 
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' 
              : 'bg-indigo-400 cursor-not-allowed opacity-70'}
          `}
          disabled={!username || !password}
          onClick={login}
        >
          Login
        </button>
        {error== 1 &&
        <button
          className="w-full py-3 rounded-lg font-medium text-white transition-all duration-300
            bg-red-600 hover:bg-red-700 shadow-md"
          onClick={handleTryAgain}
        >
          RESET 
        </button>}
      </div> 

      
    </Box>
  )
}

export default LoginPanel