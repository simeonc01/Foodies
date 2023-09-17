import {Alert} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router";
import {auth, db} from "../../firebaseConfig";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {getStorage, ref, uploadBytes} from "firebase/storage"
import {doc, setDoc} from "firebase/firestore";

function Signup() {

    const [ registerEmail, setRegisterEmail ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ registerPassword, setRegisterPassword ] = useState("");
    const [ registerPassword2, setRegisterPassword2 ] = useState("");
    const [ signupError, setSignupError] = useState("");      
    const [ loading, setLoading] = useState(false);
    
    const [ photoURL, setPhotoURL ] = useState("https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png");
    const [ photo, setPhoto] = useState();
    const storage = getStorage();

    
    const register = async () => {
        if (registerPassword !== registerPassword2) {
            setSignupError("Passordene samsvarer ikke!")
        } else if (firstName === "" || lastName === "") {
            setSignupError("Fornavn og etternavn må fylles ut!")
        } else {
            try {
                setSignupError("");
                setLoading(true);
                await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
                const currentUser = auth.currentUser;
                upload(photo, currentUser, setLoading);
                console.log("User info uploaded to database")
                goToHome();

            } catch (error) {
                console.log(error.message);
                setLoading(false);

                if (error.message.includes("auth/invalid-email")) {
                    setSignupError("Ugyldig e-post!");
                } else if (error.message.includes("auth/email-already-in-use")) {
                    setSignupError("E-posten er allerede i bruk!");
                } else if (error.message.includes("auth/weak-password")) {
                    setSignupError("Passordet må ha minst 6 tegn!");
                } else {
                    setSignupError("Klarer ikke å opprette konto!");
                }
            } 
        }
    }


    /* Lag funksjonen senere.
    const removePicture = () => {
        
    } */

    const handleChange = (e) => {
        const etf = e.target.files[0]; 
        /**
         * Checks if etf is not null and a jp(e)g- or a png-file.
         */
        if (etf && (etf.name.includes(".jpeg") || etf.name.includes(".png") || etf.name.includes(".jpg"))) {
            setPhoto(etf);
            const reader = new FileReader();
            reader.onloadend = () => {
                const data = String(reader.result);
                setPhotoURL(data);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    
    const upload = async (file, user, setLoading) => {
        if (file === undefined) {
            await setDoc(doc(db, "users", user.uid), {
                email: registerEmail,
                firstName: firstName,
                lastName: lastName,
                bio: "",
                //favoriteRecipes: ["",],
                profilePictureURL: "default.png"
            });
        } else {
            const fileRef = ref(storage, "profilePictures/" + user.uid + ".png");
            await uploadBytes(fileRef, file);
            await setDoc(doc(db, "users", user.uid), {
                email: registerEmail,
                firstName: firstName,
                lastName: lastName,
                bio: "",
                favoriteRecipes: ["",],
                profilePictureURL: user.uid
            });
        }
    } 

    const navigate = useNavigate();

    const goToHome = async () => {
        navigate("/home")
    }

    return(
        <div className="centered" style={{marginTop:"3.5em", marginLeft:"5%"}}>
            <p style={{marginBottom: 0}} >E-post:</p>
            <input onChange={(event) => {setRegisterEmail(event.target.value)}}/>
            <p style={{marginBottom: 0, marginTop: 10}}>Fornavn:</p>
            <input onChange={(event) => {setFirstName(event.target.value)}}/>
            <p style={{marginBottom: 0, marginTop: 10}}>Etternavn:</p>
            <input onChange={(event) => {setLastName(event.target.value)}}/>
            <p style={{marginBottom: 0, marginTop: 10}}>Passord:</p>
            <input onChange={(event) => {setRegisterPassword(event.target.value)}} type="password"/>
            <p style={{marginBottom: 0, marginTop: 10}}>Bekreft passord:</p>
            <input onChange={(event) => {setRegisterPassword2(event.target.value)}} type="password"/>
            <p></p>
            <div >
                <p>Profilbilde:</p>
                <img src={photoURL} alt="Avatar" className="avatar" />
                <input type="file" onChange={handleChange} />
            </div>
            {signupError && <Alert variant="danger">{signupError}</Alert>}
            <div className="space">
                <div className="inner">
                    <p></p>
                    <form onSubmit={goToHome}>
                        <button type="cancel">
                            Avbryt
                        </button>
                    </form>
                </div>
                <div className="inner">
                    <button onClick={register} disabled={loading}>
                        Bekreft
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Signup;