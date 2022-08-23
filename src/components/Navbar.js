import {NavLink} from "react-router-dom";
import { auth } from "../firebaseConfig";
import {db} from "../firebaseConfig";
import {useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";

function Navbar() {

    const usersCollectionRef = collection(db, "users")
    const [currentUser, setCurrentUser] = useState({});
    const [admin, setAdmin] = useState(false);

    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
        if (currentUser) {
            loadUser();
        } else {
            setAdmin(false);
        }
    })

    const loadUser = async () => {
        const data = await getDocs(usersCollectionRef);
        const user = data.docs.filter(doc => doc.id === currentUser.uid).reduce((a, b) => a).data();
        setAdmin(user.admin);
    }

    // Function for NavBar at top of every page. Add new NavLink to add new button to navbar. Must include new route
    // inside router in index.js for newly added NavLink to be functional.
    return (
        <div className={"sticky navbar__wrapper"}>
            <nav>
                <div>
                    <ul>
                        {currentUser === null &&
                            <>
                                <NavLink to={"/home"}> Hjem </NavLink>
                                <NavLink to='/recipes' >Oppskrifter</NavLink>
                            </>}
                        {currentUser !== null &&
                        <>
                            <NavLink to='/recipes'> Oppskrifter </NavLink>
                            <NavLink to='/newrecipe'> Ny opprskift </NavLink>
                            <NavLink to='/myprofile'> Min profil </NavLink>
                        </>}
                    </ul>
                </div>
            </nav>
        </div>
    )
}



export default Navbar;