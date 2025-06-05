import {  useEffect} from 'react';

export async function fetchFromApi(path:string) {
  const baseUrl = "http://127.0.0.1:8000/";
  try {
    const response = await fetch(baseUrl + path);
    if (!response.ok) {
      throw new Error(`Response error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch error: ${error}`);
  }
}

export async function fetchToken(username: string, password: string) {
  const response = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });

  if (!response.ok) {
    const error_data = await response.json().catch(() => null);
    const error_detail= error_data.detail || "Login failed";
    throw new Error(error_detail);
  }
  return await response.json(); // { access_token: ..., token_type: ... }
}

export async function fetchTasks(token:any) {
 const response = await fetch("http://localhost:8000/get_tasks", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

  if (!response.ok) {
    const error_data = await response.json().catch(() => null);
    const error_detail= error_data.detail || "Login failed";
    throw new Error(error_detail);
  }
  return await response.json(); // { access_token: ..., token_type: ... }
}


export async function authorize_main_test() {

      try {
        const hello = await fetch("http://localhost:8000/hello_world");
        const helloData = await hello.json();
        console.log("Message:", helloData.message);

        const token = await fetchToken("Chlebek", "password");
        console.log("Access Token:", token.access_token);
        
        const tasks = await fetchTasks(token.access_token)
        console.log(tasks)

      } catch (error) {
        console.error("Error during test fetch:", error);

        
      }
    };
