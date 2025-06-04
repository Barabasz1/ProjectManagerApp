import React, { createContext, useContext, useState } from 'react';

const ProjectsContext = createContext(null);

export const ProjectDataProvider = ({ children }) => {
  const [projectData, setProjectData] = useState([]);
  const [selectedProjectID, SetSelectedProjectID] = useState(null)
  const fetchProjects = (token) => {
    // logika fetchowania projetu
  };

  const removeProjects = (projectId, token) => {
    // czy na pewno?
  };

  const createProjects = (token, nazwe, opis) => {
    // logika tworzenia projektu
  };

  const editProjects = (token, nazwe, opis) => {
    // malo wazne ale do zrobienia
  };

  return (
    <ProjectsContext.Provider value={{ projectData, fetchProjects, removeProjects, createProjects, editProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectContext = () => useContext(ProjectsContext);
