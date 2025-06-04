import React, { createContext, useContext, useState } from 'react';

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);

  const fetchProjects = (userId) => {
    // logika fetchowania projetu
  };

  const removeProject = (projectId) => {
    // tego chyba nie?
  };

  const createProject = (newProject) => {
    // logika tworzenia projektu
  };

  const editProject = (updatedProject) => {
    // nie wiem co edytowac
  };

  return (
    <ProjectsContext.Provider value={{ projectData, fetchProjects, removeProject, createProject, editProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectsContext);
