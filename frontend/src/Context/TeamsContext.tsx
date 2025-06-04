import React, { createContext, useContext, useState } from 'react';

const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);


  const fetchTeams = async (token, project_id) => {
    // logika fetchowania zespołów
    const response = await fetch(`http://localhost:8000/get_teams?project_id=${project_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  return await response.json();
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
    // w sumie to to jest useless  (?)
    // jesli kogos nie ma w projekcie, a chce go dodać, to wprowadzam jego globalny username, i bum, już jest
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
