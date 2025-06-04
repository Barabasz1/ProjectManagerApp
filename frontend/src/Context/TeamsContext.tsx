import React, { createContext, useContext, useState } from 'react';

const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);


  const fetchTeams = (token, idprojekt) => {
    // logika fetchowania zespołów
  };

  const removeTeam = (idteam, token) => {
    // czy chcemy
  };

  const createTeam = (nazwe, token) => {
    // logika tworzenia nowego zespołu
  };

  const editTeam = (nazwa, token) => {
    // chyba tylko nazwe edytujemy?
  };
  const AssignUserToTeam = (idTeam, idUser, token) =>{
    //to do 
  }
    const UnassignUserToTeam = (idTeam, idUser, token) =>{
    //to do 
  }
  const fetchteammembers = (token, idteam) =>{

  }
  const fetchnotteammembers = (token, idteam) =>{

  }
  

  return (
    <TeamsContext.Provider
      value={{
        teamData,
        selectedTeamID,
        setSelectedTeamID,
        fetchTeams,
        removeTeam,
        createTeam,
        editTeam,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeamContext = () => useContext(TeamsContext);
