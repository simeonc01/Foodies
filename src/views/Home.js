import image1 from './../images/HomePicture1.jpg'
import image2 from './../images/HomePicture2.jpg'
import image3 from './../images/Logo.png'
//import '../../app.scss'
import {useLocation, useNavigate} from "react-router";
import {auth, db} from "../firebaseConfig";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {useState} from "react";


function Home() {

    const [currentUser, setCurrentUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })

    const navigate = useNavigate();

    const goToLogin = async () => {
        navigate("/login")
    } 

    const goToSignup = async () => {
        navigate("/signup")
    } 

    return(
        <div id="splash">
            {currentUser === null &&
            <>
                <div >
                    <img src={image3} style={{width:"45%", float:"left", marginLeft:"5em"}}/> 
                    <div>
                        <button type="saveFixedLength" onClick={goToLogin}>
                            Logg inn
                        </button>
                        <p></p>
                        <button type="saveFixedLength" onClick={goToSignup}>
                            Opprett konto
                        </button>
                    </div>
                </div>

                <br/>
                <br/>
                <br/>

                <h3>
                    <img className="dummyImage" src={image1} style={{width:"40%", height:"40%"}}/>
                    <img className="dummyImage" src={image2} style={{width:"40%", height:"40%"}}/>
                </h3>
            </>
            }
            
            {currentUser !== null &&
            <>
                <p>You are logged in!</p>
            </>
            }
        </div>
    )
}

export default Home;