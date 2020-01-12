import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
  useParams,
  useRouteMatch,
  useHistory
} from "react-router-dom";
import './App.css';
import facade from "./apiFacade";
import settings from "./settings"

function App() {

  const {getRecipes} = RecipeFactory;

  const [isLoggedIn, setIsLoggedIn] = useState(facade.loggedIn);
  let history = useHistory();


  const setLoginStatus = status => {
    setIsLoggedIn(status);
    history.push("/");
  };

  return (
    <Router>
      <Header
        loginMsg={isLoggedIn ? facade.getTokenVal('username') : "Login"}
        isLoggedIn={isLoggedIn}
      />
      <div className="container bg-light">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/recipe">
            <RecipeFactory getRecipes={getRecipes} />
          </Route>
          <Route path="/user">
          <User role = "user"/>
          </Route>
          <Route path="/login">
            <LoginHandler
              loginMsg={isLoggedIn ? "Logout" : "Login"}
              isLoggedIn={isLoggedIn}
              setLoginStatus={setLoginStatus}
            />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function RecipeFactory() {
  let recipes = [{id: 1, title: "Slow cooker spicy chicken and bean soup"},
                  {id: 2, title: "Slow cooker beef stew"},
                  {id: 3, title: "Smoked paprika goulash for the slow cooker"},
                  {id: 4, title: "Pistachio chicken with pomegranate sauce"},
                  {id: 5, title: "Cheesy leek and mustard soup"},
                  {id: 6, title: "Christmas Stollen"},
                  {id: 7, title: "Polly's eccles cakes"},
                  {id: 8, title: "Braised beef in red wine"},
                  {id: 9, title: "Moist garlic roasted chicken"},
                  {id: 10, title: "Cheese and bacon stuffed pasta shells"},
                  {id: 11, title: "Tofu vindaloo"}];
    
    let nextId = 12;
    
    const getRecipes = () => {
      return recipes;
    }
}

function Header({ isLoggedIn, loginMsg }) {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark static-top"
      id="nav"
    >
      <div className="container">
        <a className="navbar-brand text-white">
          ProEks
          </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/">Home</NavLink>
            </li>
            {isLoggedIn && (
              <React.Fragment>
                <li className="nav-item"><NavLink className="nav-link" exact to="/recipe">Recipe</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" exact to="/user">User</NavLink></li>
              </React.Fragment>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/login">{loginMsg}</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="row">
      <div className="col-lg-12 text-center">
        <h1 className="mt-5">Programmerings Eksamen</h1>
        <p className="lead">By: Joshua Joshansen</p>

      </div>
    </div>
  );
}



function Recipe() {
  const [recipeData, setRecipeData] = useState("Loading...");

   const RecipeData = () => {
    
    //let recipeArr = JSON.parse(recipeData);
    let recipeArr = recipeData;

    let frag = document.createDocumentFragment();

      for (let index = 0; index < recipeArr.length; index++) {
        let tr = document.createElement("tr");
        tr.innerHTML = recipeArr[index];
        frag.appendChild(tr);
      }
      return frag;
  }

  fetch(settings.getURL("recipeUrl"), {
    merthod: 'get',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res => res.json())
  .then(data => setRecipeData(JSON.stringify(data)))
  .catch(err => setRecipeData("Loading failed."));

  return (
    <div className="row">
      <div className="col-12">
      <h2>This is the data:</h2>
      <table id="recipelist">
          
      </table>
      </div>
    </div>
  );
}

/*function recipeFactory() {
  const [recipeData, setRecipeData] = useState("Loading...");

  fetch(settings.getURL("recipeUrl"))
  .then(res=> res.json())
  .then(data => setRecipeData(data))
  .catch(err => setRecipeData("Loading failed."));

  const addRecipe = ({recipeData}) => {
    if ({recipeData}.id === "") {
      {recipeData}recipe.id = nextId;
      recipe.push()
    }
  }
}*/



function User({role}) {
  const [userData, setUserData] = useState("Loading...");
  const [recipeData, setRecipeData] = useState("Loading...");
  const [table, setTable] = useState(recipeData);

  var opts = facade.makeOptions("GET",true)


  fetch(settings.getURL("userUrl") + role ,opts)
  .then(res=> res.json())
  .then(data => setUserData(data.message))
  .catch(err => setUserData("Loading failed."));

  fetch(settings.getURL("recipeUrl"))
  .then(res=> res.json())
  .then(data => {
    setRecipeData(data)
    setTable(mapper(data))
  })
  .catch(err => setRecipeData("Loading failed."));

  const SearchRecipe = (urlend) =>{
    fetch(settings.getURL("recipeUrl") + urlend)
    .then(res => res.json())
    .then((data) => {
      setRecipeData(data)
    })
  }

  const mapper = (array) => {
    return array.map((r) => {
      return <tr key={r.id}><th> {r.id} </th>
        <td> {r.description} </td>
      </tr>
    })
  }

  const RecipeSearchForm = () => {
    const [recipe, setRecipe] = useState("");

    return(
      <div>
        <span>søg efter en person</span>
        <input type="text" onChange={(event)=>setRecipe(event.target.value)} value={recipe} />
        <button type="button" onClick={() => recipe == '' ? alert("Søg venligst efter en person") : SearchRecipe('name/' + recipe)}>Search</button> 
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
      <h2>This is the data:</h2>
      <p>{userData}</p>
      <RecipeSearchForm />
      <p>{table}</p>
      
      </div>
    </div>
  );
}

function AddBook({ bookFactory }) {
  const [bookTitle, changeBookTitle] = useState("");
  const [bookInfo, changeBookInfo] = useState("");
  return (
    <div>
      <h2>Add book</h2>
      Title: <input type="text" onChange={(event) => changeBookTitle(event.target.value)} value={bookTitle} /><br />
      Info: <input type="text" onChange={(event) => changeBookInfo(event.target.value)} value={bookInfo} /><br />
      <button onClick={() => bookFactory.addBook({ title: bookTitle, info: bookInfo })}>Save</button>
      <p>{bookTitle}</p>
      <p>{bookInfo}</p>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Siden kunne ikke findes.</h2>
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div>
      <div className="row justify-content-center">
        <h1>Login</h1>
      </div>
      <div className="row">
        <div className="col-4">
        </div>
        <div className="col-4 text-center">
          <form onChange={onChange}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Username</label>
              <input type="text" className="form-control" placeholder="Enter username" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input type="password" className="form-control" placeholder="Password" id="password" />
            </div>
            <button type="submit" className="btn btn-success" onClick={performLogin}>Login</button>
          </form>
        </div>
        <div className="col-4">
        </div>
      </div>
    </div>
  )

}
function LoggedIn() {
  // const [dataFromServer, setDataFromServer] = useState("Loading...")

  // useEffect(() => {
  //   facade.fetchData().then(data => setDataFromServer(data.msg));
  // }, [])

  return (
    <div>
      <div className="row justify-content-center">
        <h1>User page</h1>
      </div>
      <div className="row">
        <div className="col-3">
        </div>
        <div className="col-6">
          <b>Username:</b> {facade.getTokenVal("username")}
          <br/>
          <b>Role:</b> {facade.getTokenVal("roles")}
        </div>
        <div className="col-3">
        </div>
      </div>
    </div>
  )

}

function LoginHandler({ isLoggedIn, setLoginStatus }) {
  const [loggedIn, setLoggedIn] = useState(facade.loggedIn)

  const logout = () => {
    facade.logout()
    setLoggedIn(false)
    setLoginStatus(!isLoggedIn);
  }
  const login = (user, pass) => {
    facade.login(user, pass)
      .then(res => setLoginStatus(!isLoggedIn))
  }

  return (
    <div>
      {!isLoggedIn ? (<LogIn login={login} />) :
        (<div className="text-center">
          <LoggedIn />
          <br/>
          <button type="button" className="btn btn-danger" onClick={logout}>Logout</button>
        </div>)}
    </div>
  )

}


export default App;
