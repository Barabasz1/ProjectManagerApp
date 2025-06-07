import React, { createContext, useContext, useState } from 'react';

import {get,post,del} from './api_request'

const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);


   const fetchTeams = async (token, project_id) => {
    // logika fetchowania zespołów
<<<<<<< HEAD
    return get(`get_teams/${project_id}`)
=======
    const response = await fetch(`http://localhost:8000/get_teams?project_id=${project_id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  const result = await response.json();
  setTeamData(result)
>>>>>>> Frontend
  };

  const removeTeam = (idteam, token) => {
    return del(`delete_team/${idteam}`,token)
  };

  const createTeam = (token,nazwa,project_id) => {
    return post(`create_team`,token,{
      name:nazwa,
      project_id:project_id
    })
  };

  const editTeam = (nazwa, token) => {
    // chyba tylko nazwe edytujemy?
  };
  const AssignUserToTeam = (token,idTeam, idUser, role) =>{
    return post(`add_user_to_team`,token,{
      user_id:idUser,
      team_id:idTeam,
      role:role
    })
  }
    const UnassignUserToTeam = (idTeam, idUser, token) =>{
    return del(`remove_user_from_team/${idTeam}/${idUser}`,token)
  }
  const fetchteammembers = (token, idteam) =>{
    return get(`get_teammembers/${idteam}`,token)
  }
  const fetchnotteammembers = (token, idteam) =>{
<<<<<<< HEAD
    // w sumie to to jest useless  (?)
    // jesli kogos nie ma w projekcie, a chce go dodać, to wprowadzam jego globalny username, i bum, już jest
    return get(`get_nonteammembers/${idteam}`,token)
=======

>>>>>>> Frontend
  }
  

  return (
    <TeamsContext.Provider
      value={{
        teamData,
        fetchTeams,
        removeTeam,
        createTeam,
        editTeam,
        AssignUserToTeam,
        UnassignUserToTeam,
        fetchnotteammembers,
        fetchteammembers
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeamContext = () => useContext(TeamsContext);
