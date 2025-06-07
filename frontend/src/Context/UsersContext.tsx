import React, { createContext, useContext, useState } from 'react';

const UsersContext = createContext(null);

import {get,post,del} from './api_request'

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const fetchUsers = async () => {
    return await get('get_users',null)
  };

  const removeUser = (token,userId) => {
      del(`delete_user/${userId}`,token)
  };

  const createUser = (login,password) => {
      post('register',token,{login:login,password:password})
  };

  const editUser = (updatedUser) => {
    // logika edycji danych użytkownika
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
