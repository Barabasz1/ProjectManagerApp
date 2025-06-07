import React, { createContext, useContext, useState } from 'react';

import {get,post,del} from './api_request'

const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);


  const fetchTeams = async (token, project_id) => {
    // logika fetchowania zespołów
    return get(`get_teams/${project_id}`)
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
    // w sumie to to jest useless  (?)
    // jesli kogos nie ma w projekcie, a chce go dodać, to wprowadzam jego globalny username, i bum, już jest
    return get(`get_nonteammembers/${idteam}`,token)
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
