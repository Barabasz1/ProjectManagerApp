import React, { createContext, useContext, useState } from 'react';
import {get,post,del} from './api_request'

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectID, SetSelectedProjectID] = useState(1) //do zmiany

  const fetchProjects = (token,user_id) => {
    return get(`get_projects/${user_id}`,token)
  };

  const removeProjects = (projectId, token) => {
    return del(`delete_project/${projectId}`,token)
  };

  const createProjects = (token, nazwa, opis) => {
    return post('create_project',token,{project_name:nazwa,description:opis,manager:1})// swap for current user id})
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
