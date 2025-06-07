


function get_url(){
    return 'http://localhost:8000/'
}
async function parse_response(response:Response,custom_error: string | null = null){
    if (!response.ok) {
        let error_message:string = "Failed to fetch";

        if(custom_error != null){
            error_message = custom_error;
        }
        throw new Error(error_message);
    }
    return await response.json();
}
async function get_response(path:string,method:'GET' | 'POST' | 'DELETE' | 'PATCH',token:string | null, data:any | null){

    const url = get_url().concat(path)
    let response = null;

    if (token==null) {
        response = await fetch(get_url().concat(url))
    } else {
        if(data==null){
        response = await fetch(get_url().concat(url), {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    } else {
    
        response = await fetch(get_url().concat(url), {
        method: method,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
        });
    }
    }
  
    return parse_response(response)
}


export async function get(path:string,token:string | null){
    return await get_response(path,'GET',token,null)
}

export async function post(path:string,token:string | null,data) {
    return await get_response(path,'POST',token,data)
}

export async function del(path:string,token:string) {
    return await get_response(path,'DELETE',token,null)
}

export async function patch(path:string,token:string,data) {
    return await get_response(path,'PATCH',token,data)
}