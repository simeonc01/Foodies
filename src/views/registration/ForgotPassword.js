import {auth} from "../../firebaseConfig";
import {sendPasswordResetEmail} from "firebase/auth";
import {Alert} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router";


function ForgotPassword() {

    const [ email, setEmail ] = useState("");
    const [ confirmedMsg, setConfirmedMsg] = useState(""); 
    const navigate = useNavigate();

    const goToLogin = async () => {
        navigate("/login")
    }

    const resetPassword = async () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setConfirmedMsg("Hurra!")
            goToLogin();
        })
        .catch((error) => {
            setConfirmedMsg("E-posten eksisterer ikke!");
            console.log("Dette gikk ikke!")
        })
    }

    return(
        <div className="centered">
            <h2>Tilbakestill passord</h2>
            <p>E-post:</p>
            <input onChange={(event) => {setEmail(event.target.value)}}/>
            <p></p>
            <div className="centerButtons">
                <button onClick={resetPassword}>
                    Tilbakestill passord
                </button>
                <button onClick={goToLogin} type="cancel">
                    Avbryt
                </button>
            </div>
            {confirmedMsg && <Alert variant="danger">{confirmedMsg}</Alert>}
        </div>
    )
}

export default ForgotPassword;

