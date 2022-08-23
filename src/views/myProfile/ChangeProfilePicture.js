import { onAuthStateChanged, signOut} from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import { useNavigate } from "react-router";
import {collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {Card} from "react-bootstrap";
import { Alert } from "react-bootstrap";


function ChangeProfilePicture() {

    const navigate = useNavigate();
    const user = auth.currentUser
    const [photoURL, setPhotoURL] = useState("")
    const [photo, setPhoto] = useState("")
    const [name, setName] = useState("")
    const [ errorMsg, setErrorMsg] = useState(""); 
    const usersCollectionRef = collection(db, "users")
    const storage = getStorage();

    useEffect(() => {
            loadUser();
        }, []
    )

    const handleChange = (e) => {
        const etf = e.target.files[0]; 
        setName(etf.name);
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


    const loadUser = async () => {
        const data = await getDocs(usersCollectionRef);
        const currentUser = data.docs.filter(doc => doc.id === user.uid).reduce((a, b) => a).data();
        if (currentUser.profilePictureURL === user.uid) {
            handleDownloadImage();
        } else {
            handleDownloadDefault();
        }

    }

    const handleDownloadImage = async () => {
        const imageRef = ref(getStorage(), 'profilePictures/' + user.uid + '.png');
        getDownloadURL(imageRef)
            .then((url) => {
                setPhotoURL(url)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const handleDownloadDefault = async () => {
        const imageRef = ref(getStorage(), 'profilePictures/' + "default.png");
        getDownloadURL(imageRef)
            .then((url) => {
                setPhotoURL(url)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const goToProfilePage = async () => {
        navigate("/myprofile")
    }

    const save = async () => {
        if (name === "") {
            setErrorMsg("Ingen fil valgt!")
        } else {
            setErrorMsg("")
            const fileRef = ref(storage, "profilePictures/" + user.uid + ".png");
            const snapshot = await uploadBytes(fileRef, photo);

            const washingtonRef = doc(db, "users", user.uid);
            await updateDoc(washingtonRef, {
                profilePictureURL: user.uid
            });
            
            navigate("/profilePage") 
        }
    }



    return(
        <div >
            <div>
                <Card.Img variant="top" src={photoURL} className="profileImage2" style={{marginBottom:"4em", marginTop:"4em"}}/>
            </div>
            <div className="centered2">
                <input type="file" onChange={handleChange} />
                <button type="save" onClick={save}>Last opp</button>
                <button type="cancel" onClick={goToProfilePage}>Avbryt</button>
            </div>
            <p></p>
            {errorMsg && <Alert variant="danger" style={{marginTop:"7em"}}>{errorMsg}</Alert>}
        </div>
    )
}

export default ChangeProfilePicture;