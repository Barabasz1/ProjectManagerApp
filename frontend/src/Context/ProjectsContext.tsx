import React, { createContext, useContext, useState } from 'react';

import {get,post,del} from './api_request'

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);
<<<<<<< HEAD
  const [selectedProjectID, SetSelectedProjectID] = useState(null)

=======
  const [selectedProjectID, SetSelectedProjectID] = useState(1) //do zmiany
>>>>>>> Frontend
  const fetchProjects = (token) => {
      return get('get_projects',token)
  };

  const removeProjects = (token,project_id:number) => {
    return del(`delete_project/${project_id}`,token)
  };

  const createProjects = (token, name:string, description:string) => {
    return post('create_project',token,{project_name:name,description:description})
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
