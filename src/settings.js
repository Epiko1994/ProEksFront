const URLs = {
    "loginApi": "http://localhost:8080/securitystarter",
    "userUrl" : "http://localhost:8080/securitystarter/api/info/",
    "swapiUrl": "http://localhost:8080/securitystarter/api/info/swapidata"
}

function Settings() {
    const getURL = (key) => { return URLs[key] }

    return {
        getURL
    }
}
export default Settings();