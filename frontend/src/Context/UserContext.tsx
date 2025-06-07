import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(-1);
  const [error, setError] = useState(0);
  const [token, setToken] = useState(null)
  
  

  const removeUser = async (userId, token) => {
    // logika usuwania użytkownika
    del(`delete_user/${userId}`,token)
  };

  const createUser = async (login, password) => {
    console.log(login)
    console.log(password)
    post('register',null,{login:login,password:password})

    // i potem robimy loginUser(login, password)
  };

  const loginUser = async (username, password) => {
    
     const response = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) {
    
    const error_data = await response.json().catch(() => null);
    const error_detail= error_data.detail || "Login failed";
    console.log("dsad")
    setError(1)
    throw new Error(error_detail);
  }
  const token= await response.json();
  
  setToken(token.access_token)
  setUser(1)
  setError(0)

  };

  const logOut = () => {
    setUser(-1)
    setError(0)
    setToken(null)
   
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser,
        loginUser,
        token,
        setToken,
        error,
        setError,
        logOut,
        createUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);