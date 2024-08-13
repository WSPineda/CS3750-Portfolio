import React from "react";
import { Route, Routes} from "react-router-dom";
import Records from "./components/records.js";
import Create from "./components/create.js";
import Edit from "./components/edit.js";
import SessionSet from "./components/session_set.js";
import SessionGet from "./components/session_get.js";
import SessionDelete from "./components/session_delete.js";
import Signin from "./components/signin.js";
import Signedin from "./components/signedin.js";


const App = () =>{
  return (
      <div>
        <Routes>
          <Route path="/" element ={<Records />}/>
          <Route path="/create" element = {<Create />}/>
          <Route path="/edit/:id" element = {<Edit />}/>
          <Route path="/session_set" element = {<SessionSet />}/>
          <Route path="/session_get" element = {<SessionGet />}/>
          <Route path="/session_delete" element = {<SessionDelete />}/>
          <Route path="/signin" element = {<Signin />}/>
          <Route path="/signedin" element = {<Signedin />}/>
        </Routes>


      </div>


  );

}

export default App;
