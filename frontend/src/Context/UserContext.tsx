import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(-1);
  const [token, setToken] = useState(null)
  
  

  const removeUser = async (userId, token) => {
    // logika usuwania użytkownika
  };

  const createUser = async (token, username, email, password) => {
    // logika tworzenia użytkownika
  };

  const loginUser = async (username, password) => {
    console.log(username)
     const response = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) {
    const error_data = await response.json().catch(() => null);
    const error_detail= error_data.detail || "Login failed";
    throw new Error(error_detail);
  }
  const token= response.json();
  console.log(token)

  };

  const logoutUser = () => {
    // logika wylogowywania użytkownika
   
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser,
        loginUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);