import {useState} from "react";
import {useNavigate} from "react-router";
import {auth, db} from "../../firebaseConfig";
import {signInWithEmailAndPassword} from "firebase/auth";
import {Alert} from "react-bootstrap";
import {collection, getDocs} from "firebase/firestore";

function Login() {

    const [ loginEmail, setLoginEmail ] = useState("");
    const [ loginPassword, setLoginPassword ] = useState("");
    const [ loginError, setLoginError] = useState(""); 

    const usersCollectionRef = collection(db, "users")

    const login = async () => {
        try {
            setLoginError("");
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            await getDocs(usersCollectionRef);
            goToHome()

        } catch (error) {
            console.log(error);
            if (error.message.includes("auth/invalid-email")) {
                setLoginError("Ugyldig e-post!");
            } else {
                setLoginError("E-post eller passord er er feil!");
            }
        }
    }
    
    const navigate = useNavigate();

    const goToHome = async () => {
        navigate("/")
    }
    
    const goToSignup = async () => {
        navigate("/signup")
    } 
    
    const goToForgotPassword = async () => {
        navigate("/forgotpassword")
    } 

    return(
        <div className="centered">
            <p>E-post:</p>
            <input onChange={(event) => {setLoginEmail(event.target.value)}}/>
            <br/>
            <br/>
            <p>Passord:</p>
            <input onChange={(event) => {setLoginPassword(event.target.value)}} type="password"/>
            <p></p>
            {loginError && <Alert variant="danger">{loginError}</Alert>}
            <button onClick={login}>
                Logg inn
            </button>
            <form style={{marginTop:"5%"}}>
                <p> Har du ikke en konto?      
                    <span onClick={goToSignup}>
                        <mark>Registrer deg</mark> 
                    </span>
                </p>
            </form>
            <form>   
                <span onClick={goToForgotPassword} >
                    <mark>Glemt passord?</mark> 
                </span>
            </form>
        </div>
    )
}

export default Login;