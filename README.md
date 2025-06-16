# Overview

ProjectManagerApp is a full-stack project-management solution that combines a robust backend API, a structured database, and a modern React-based frontend UI.  
It facilitates organizing, tracking, and visualizing project tasks within a Kanban view, supporting efficient team collaboration and workflow management.

## Why ProjectManagerApp?

This project aims to streamline project oversight by integrating user authentication, task management, and team coordination into a cohesive platform.  
The core features include:

- **Secure Authentication:** Essential user login and registration endpoints ensure safe access control.  
- **Backend API:** FastAPI endpoints for managing projects, tasks, teams, and users with CRUD capabilities.  
- **Rich UI Components:** Responsive, customizable React components for project visualization, task handling, and user interaction.  
- **Development Utilities:** Scripts for environment setup, database initialization, testing, and deployment streamline the development workflow.  
- **Database Management:** Structured SQLite database with utilities for data export, inspection, and maintenance.  

---

# Getting Started

## Prerequisites

This project requires the following dependencies:

- **Programming Language:** TypeScript, Pyton
- **Package Manager:** npm, pip


# To build and run using docker
## Navigate to project root directory and run:

`docker-compose up`
- use option `--no-build` to use an exisiting image
- use option `-d` to run in the background

# Installation on Windows

Build **ProjectManagerApp** from source and install dependencies:

## Navigate to the project root directory
`cd ProjectManagerApp`

## Install dependencies
### From /frontend/
`npm install`
### From /backend/
`pip install -r requirements.txt`

## Start the application
### From /frontend/
`npm start`
### From /backend/
`uvicorn main:app --host 0.0.0.0 --port 8000`

### Now you can access the app on http://localhost:5173/

## run the test suite
`npm test`
