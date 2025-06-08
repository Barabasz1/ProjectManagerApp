import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectID, SetSelectedProjectID] = useState(1) //do zmiany
  //private
   const [userId, setUserId] = useState(null);
  
  const fetchProjects = async (token,user_id) => {
    setUserId(user_id)
    console.log("fetch projects")
     const data = await get(`get_projects/${user_id}`,token)
     setProjectData(data)
  };

  const removeProjects = async (projectId, token) => {
    console.log("remove project")
    await del(`delete_project/${projectId}`,token)
    await fetchProjects(token, userId)
  };

  const createProjects = async (token, nazwa, opis) => {
    console.log("dsa")
    console.log(token)
    console.log(nazwa)
    console.log(opis)
   //await post('create_project',token,{project_name:nazwa,description:opis,manager:1})// swap for current user id})
    //tutaj nie dziala post, to ma sie dodac i ponizej fetchuje od nowa nowe dane
    await fetchProjects(token, userId)
  };

  const editProjects = (token, nazwe, opis) => {
    // malo wazne ale do zrobienia
  };

  return (
    <ProjectsContext.Provider value={{ projectData,setProjectData, selectedProjectID, SetSelectedProjectID, fetchProjects, removeProjects, createProjects, editProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectsContext);
