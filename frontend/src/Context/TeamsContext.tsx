import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'
const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);


   const fetchTeams = async (token, project_id) => {
    const result = await get(`get_teams/${project_id}`,token)
    setTeamData(result)
  };

  const removeTeam = (idteam, token) => {
    return del(`delete_team/${idteam}`,token)
  };

  const createTeam = (nazwa, project_id,token) => {
    return post(`create_team`,token,{
      name:nazwa,
      project_id:project_id
    })
  };

  const editTeam = (nazwa, token) => {
    // chyba tylko nazwe edytujemy?
  };

  const AssignUserToTeam = (idTeam, idUser,role, token) =>{
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
  turn get(`get_nonteammembers/${idteam}`,token)
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
