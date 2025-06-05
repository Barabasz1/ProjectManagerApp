import React, { createContext, useContext, useState } from 'react';

const UsersContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const fetchUsers = () => {
    // logika pobierania użytkowników
  };

  const removeUser = (userId) => {
    // logika usuwania użytkownika
  };

  const createUser = (newUser) => {
    // logika tworzenia nowego użytkownika
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
