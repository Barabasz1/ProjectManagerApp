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
    console.log("fetch teams 2")
    console.log(token)
    console.log(project_id)

    if(project_id ==-1)
    {
      setTeamData([]);
      return 0;
    }
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
  console.log(result)
  };

  const removeTeam = async (idteam, token) => {
    console.log("usuwanie")
    console.log(token)
    console.log(idteam)
    await del(`delete_team/${idteam}`,token)
    await fetchTeams(token, project_id)
  };

  const createTeam = async (token, nazwa, project_id) => {
    console.log("create team")
    console.log(project_id)
    console.log(nazwa)
    console.log(token)
    await post(`create_team`,token,{   name:nazwa,      project_id:project_id})
    await fetchTeams(token,project_id )
  };

  const updateTeam = async (id, nowanazwa, token) => {
    console.log("update teamu")
    console.log(id)
    console.log(nowanazwa)
    console.log(token)
    
    await patch(`edit_team/${id}`,token,create_obj_clean_undefined({
      name:nowanazwa
    }))
    await fetchTeams(token, project_id)
  };

  const AssignUserToTeam = async(idTeam, idUser,role, token) =>{
    console.log("assigning")
    console.log(idTeam)
      console.log(idUser)
       console.log(role)

    await post(`add_user_to_team`,token,{
      user_id:idUser,
      team_id:idTeam,
      role:role
    })
    
    await fetchnotteammembers(token, idTeam)
    await fetchteammembers(token, idTeam)
  }

    const UnassignUserToTeam = async (idTeam, idUser, token) =>{
      console.log("unassigning")
      console.log(idTeam)
      console.log(idUser)
     
    await del(`remove_user_from_team/${idTeam}/${idUser}`,token)


    await fetchnotteammembers(token, idTeam)
    await fetchteammembers(token, idTeam)
  }
  const fetchteammembers = async (token, idteam) =>{
    console.log("fetching members")
    console.log(idteam)
    console.log(token)
    
     const data =  await get(`get_teammembers/${idteam}`,token)
          console.log(data)
          setUsersInProject(data)
  }
  const fetchnotteammembers = async (token, idteam) =>{
    console.log("fetching not members")
    
  const data =  await get(`get_nonteammembers/${idteam}`,token)
      console.log(data)
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
