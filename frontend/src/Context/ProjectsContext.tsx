import React, { createContext, useContext, useState } from 'react';
import {get,post,del,patch} from './api_request'
import {create_obj_clean_undefined} from './utils'

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectID, SetSelectedProjectID] = useState(null) //do zmiany
  //private
   const [userId, setUserId] = useState(null);
  
  const fetchProjects = async (token,user_id) => {
    setUserId(user_id)
     const data = await get(`get_projects/${user_id}`,token)
     setProjectData(data)
  };

  const removeProjects = async (projectId, token) => {

    await del(`delete_project/${projectId}`,token)
    await fetchProjects(token, userId)
  };

  const createProjects = async (token, nazwa, opis) => {

   await post('create_project',token,{project_name:nazwa,project_description:opis,manager:userId})// swap for current user id})
    await fetchProjects(token, userId)
  };

  const editProject = async (token, nazwa, IdProj) => {

    await patch(`edit_project/${IdProj}`,token,create_obj_clean_undefined({
      name:nazwa,
      description:undefined,
      manager:undefined,
      version:undefined,
      deadline:undefined
    }))
    await fetchProjects(token,userId )
  };

  return (
    <ProjectsContext.Provider value={{ projectData,editProject,setProjectData, selectedProjectID, SetSelectedProjectID, fetchProjects, removeProjects, createProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectsContext);
