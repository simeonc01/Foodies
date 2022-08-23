import {useState} from "react";
import {useNavigate} from "react-router";
import {Alert} from "react-bootstrap";
import {onAuthStateChanged, updatePassword} from "firebase/auth";
import {auth} from "../../firebaseConfig";

function ChangePassword() {

    const [ newPassword, setNewPassword ] = useState("");
    const [ newPassword2, setNewPassword2 ] = useState("");
    const [ signupError, setSignupError] = useState(""); 
    const [ signupError2, setSignupError2] = useState(""); 

    const [currentUser, setCurrentUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })

    const handleChangePassword = async () => {
        if (newPassword !== newPassword2) {
            setSignupError("Passordene samsvarer ikke!")
        }
        else {
            updatePassword(currentUser, newPassword).then(() => {
                goToProfilePage();
              }).catch((error) => {
                if (error.message.includes("auth/requires-recent-login")) {
                    setSignupError("Innloggingstiden er utløpt.");
                    setSignupError2("Logg inn på nytt for å endre passord!");
                } else {
                    setSignupError("Klarer ikke å endre passord!")
                }
              });
        }
    }

    const navigate = useNavigate();

    const goToProfilePage = async () => {
        navigate("/myprofile")
    }


    return(
        <div className="centered">
            <p>Nytt passord:</p>
            <input onChange={(event) => {setNewPassword(event.target.value)}} type="password"/>
            <p style={{marginTop:"1em"}}>Bekreft nytt passord:</p>
            <input onChange={(event) => {setNewPassword2(event.target.value)}} type="password"/>
            <div > 
                <h1></h1>
                {signupError && <Alert variant="danger">{signupError}</Alert>}
                {signupError2 && <Alert variant="danger">{signupError2}</Alert>}
                <h1></h1>
                <button type="cancel" onClick={goToProfilePage}>Avbryt</button>
                <button type="save" onClick={handleChangePassword}>Bekreft endringer</button>
            </div>
            <p></p>
        </div>
    )
}

export default ChangePassword;