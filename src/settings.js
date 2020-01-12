const URLs = {
    "loginApi": "http://localhost:8080/krak",
    "userUrl" : "http://localhost:8080/krak/api/info/",
    "recipeUrl": "http://localhost:8080/krak/api/info/recipe/"
}

function Settings() {
    const getURL = (key) => { return URLs[key] }

    return {
        getURL
    }
}
export default Settings();