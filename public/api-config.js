const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://turtle-dove-backend.onrender.com";

async function readResponse(response){
    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();

    if(!body){
        return {};
    }

    if(!contentType.includes("application/json")){
        throw new Error("The chat server returned an invalid response.");
    }

    try{
        return JSON.parse(body);
    }catch(error){
        throw new Error("The chat server returned invalid data.");
    }
}