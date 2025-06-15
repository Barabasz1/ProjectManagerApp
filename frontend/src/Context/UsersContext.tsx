import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'
const UsersContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);
  

  const fetchUsers = async () => {
    const data =  await get('get_users',null)
    console.log("userzy fetchowani")
    console.log(data)
    setUserData(data)
  };
  
  

  const removeUser = (token,userId) => {
    del(`delete_user/${userId}`,token)
  };

  const createUser = (login,password) => {
    post('register',null,{login:login,password:password})
  };

  const editUser = (token,userId,) => {
    
  };


  return (
    <UsersContext.Provider
      value={{
        userData,
        selectedUserID,
        setSelectedUserID,
        fetchUsers,
        removeUser,
        createUser,
        editUser,
       
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = () => useContext(UsersContext);
