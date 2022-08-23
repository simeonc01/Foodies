import {Route, Routes} from "react-router-dom";
import './App.css';

import Navbar from "./components/Navbar";
import Home from "./views/Home"
import Recipes from "./views/Recipes"
import NewRecipe from "./views/NewRecipe"
import MyProfile from "./views/MyProfile"

import Login from "./views/registration/Login";
import ForgotPassword from "./views/registration/ForgotPassword";
import Signup from "./views/registration/Signup";

import ChangeBio from "./views/myProfile/ChangeBio";
import EditProfile from "./views/myProfile/EditProfile";
import ChangeProfilePicture from "./views/myProfile/ChangeProfilePicture";
import DeleteUser from "./views/myProfile/DeleteUser";
import ChangePassword from "./views/myProfile/ChangePassword";

import RecipePage from "./views/recipes/RecipePage";

function App() {
  return (
    <div >
      <Navbar/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Routes>
        <Route path="/*" element={<Recipes/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/newrecipe" element={<NewRecipe/>}/>
        <Route path="/myprofile" element={<MyProfile/>}/>

        {/* Registration */}
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/signup" element={<Signup/>}/>

        {/* My profile */}
        <Route path="/changebio" element={<ChangeBio/>}/>
        <Route path="/changeprofilepicture" element={<ChangeProfilePicture/>}/>
        <Route path="/deleteuser" element={<DeleteUser/>}/>
        <Route path="/editprofile" element={<EditProfile/>}/>
        <Route path="/changepassword" element={<ChangePassword/>}/>

        {/* Recipes */}
        <Route path="recipepage" element={<RecipePage/>}/>


      </Routes>
    </div>
  );
}

export default App;
