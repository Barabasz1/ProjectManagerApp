import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'
export const UserContext = createContext(null);
import jwt_decode from "jwt-decode"; 

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload); // dekodowanie base64
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(-1);
  const [error, setError] = useState(0);
  const [token, setToken] = useState(null);
  const [idUser, SetUserId] = useState(null);
  const [name, setName] = useState("temp name")
  
  

  const removeUser = async (userId, token) => {
    // logika usuwania użytkownika
    del(`delete_user/${userId}`,token)
  };

  const createUser = async (name,login, password) => {
    console.log(name)
    console.log(login)
    console.log(password)
    await post('register',null,{login:login,password:password})

    await loginUser(login, password)
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
    
    setError(1)
    throw new Error(error_detail);
  }
  const token = await response.json();
setToken(token.access_token);


const decoded = decodeJWT(token.access_token);


  setUser(1)
  setError(0)
  setName(decoded.sub)
  SetUserId(decoded.user_id)
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
        createUser,
        idUser,
        SetUserId,
        name,
        setName
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);