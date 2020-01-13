const URLs = {
    "loginApi": "https://epiko.dk/KA3-backend",
    "userUrl" : "https://epiko.dk/KA3-backend/api/",
    "recipeUrl": "https://epiko.dk/KA3-backend/api/info/recipe/"
}

/*const URLs = {
    "loginApi": "http://localhost:8080/krak",
    "userUrl" : "http://localhost:8080/krak/api/",
    "recipeUrl": "http://localhost:8080/krak/api/info/recipe/"
}*/

function Settings() {
    const getURL = (key) => { return URLs[key] }

    return {
        getURL
    }
}
export default Settings();