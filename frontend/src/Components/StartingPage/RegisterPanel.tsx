import React, { useState } from 'react'
import { Box, Typography } from '@mui/material';
import { useUserContext } from '@/Context/UserContext';

const RegisterPanel = () => {
  const [name, setName] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {createUser} = useUserContext()
   const register = () => {
   
    try {
      createUser(name, login, password)
    }
    catch(error){
      console.log("Failed")
    }
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
        Create Account
      </Typography>
      
      <div className="w-full space-y-4">
        {/* Name Field */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 
              ${name ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} 
              focus:border-indigo-600 focus:shadow-md text-indigo-950`}
            placeholder="Name"
          />
        </div>

        {/* Login Field */}
        <div className="relative">
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all duration-300 
              ${login ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'} 
              focus:border-indigo-600 focus:shadow-md text-indigo-950`}
            placeholder="Login"
          />
        </div>

        {/* Password Field */}
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

        {/* Register Button */}
        <button 
          className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300
            ${name && login && password 
              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md' 
              : 'bg-indigo-400 cursor-not-allowed opacity-70'}
          `}
          disabled={!name || !login || !password}
          onClick={()=> register()}
        >
          Register
        </button>
      </div>
    </Box>
  )
}

export default RegisterPanel