
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

