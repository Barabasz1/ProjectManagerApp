import React, { createContext, useContext, useState } from 'react';
import {get,post,del,patch} from './api_request'
import {create_obj_clean_undefined} from './utils'
const TeamsContext = createContext(null);

export const TeamDataProvider = ({ children }) => {
  const [teamData, setTeamData] = useState([]);
  const [usersInProject, setUsersInProject] = useState([]);
     const [usersInNotProject, setUsersNotInProject] = useState([]);
    //private
    const [project_id, setProject_id] = useState(null)
    

     const fetchTeams = async (token, project_id) => {
    setProject_id(project_id)
    const response = await fetch(`http://localhost:8000/get_teams/${project_id}`, {
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
  };

  const removeTeam = async (idteam, token) => {

    await del(`delete_team/${idteam}`,token)
    await fetchTeams(token, project_id)
  };

  const createTeam = async (token, nazwa, project_id) => {

    await post(`create_team`,token,{   name:nazwa,      project_id:project_id})
    await fetchTeams(token,project_id )
  };

  const updateTeam = async (id, nowanazwa, token) => {

    
    await patch(`edit_team/${id}`,token,create_obj_clean_undefined({
      name:nowanazwa
    }))
    await fetchTeams(token, project_id)
  };

  const AssignUserToTeam = async(idTeam, idUser,role, token) =>{


    await post(`add_user_to_team`,token,{
      user_id:idUser,
      team_id:idTeam,
      role:role
    })
    
    await fetchnotteammembers(token, idTeam)
    await fetchteammembers(token, idTeam)
  }

    const UnassignUserToTeam = async (idTeam, idUser, token) =>{

    await del(`remove_user_from_team/${idTeam}/${idUser}`,token)


    await fetchnotteammembers(token, idTeam)
    await fetchteammembers(token, idTeam)
  }
  const fetchteammembers = async (token, idteam) =>{

     const data =  await get(`get_teammembers/${idteam}`,token)

          setUsersInProject(data)
  }
  const fetchnotteammembers = async (token, idteam) =>{

    
  const data =  await get(`get_nonteammembers/${idteam}`,token)

      setUsersNotInProject(data)
  }
  

  return (
    <TeamsContext.Provider
      value={{
        teamData,
        fetchTeams,
        removeTeam,
        createTeam,
        updateTeam,
        AssignUserToTeam,
        UnassignUserToTeam,
        fetchnotteammembers,
        fetchteammembers,
        usersInProject,
        usersInNotProject
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeamContext = () => useContext(TeamsContext);
