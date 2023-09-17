import Textarea from 'react-textarea-autosize';
import {useState} from "react";
import {useNavigate} from "react-router";
import {auth, db} from "../../firebaseConfig";
import {onAuthStateChanged} from "firebase/auth";
import {collection, doc, getDocs, updateDoc} from "firebase/firestore";


function ChangeBio() {

    const usersCollectionRef = collection(db, "users")
    const [oldBio, setOldBio] = useState("")
    const [newBio, setNewBio] = useState("")
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        loadUser();
    })

    const loadUser = async () => {
        const data = await getDocs(usersCollectionRef);
        const dataFields = data.docs.filter(doc => doc.id === user.uid).reduce((a, b) => a).data();
        if (dataFields.bio === "") {
            setOldBio("(Ingen bio)");
        } else {
            setOldBio(dataFields.bio);
        }
    }

    const updateBio = async () => {
        const washingtonRef = doc(db, "users", user.uid);
        await updateDoc(washingtonRef, {
            bio: newBio
          });
        goToProfilePage();
    }

    const navigate = useNavigate();

    const goToProfilePage = async () => {
        navigate("/myprofile")
    }

    return(
        <div className={"card"} style={{width:"50%", marginLeft:"25%", marginTop:"2em"}}>
            <h4 className={"input__label"} style={{marginLeft:"5%"}}>Nåværende bio: </h4>
            <p className='bioHeader' style={{marginLeft:"5%"}}><em>{oldBio}</em></p>
            <h4 className={"input__label"} style={{marginLeft:"5%"}}>Ny bio: </h4>
            <Textarea
                onChange={(event) => {setNewBio(event.target.value)}}
                type={"textarea"}
                className={"input__field__big"}
                />
            <div className="centerObject"> 
                <h1></h1>
                <button type="cancel" onClick={goToProfilePage}>Avbryt</button>
                <button type="save" onClick={updateBio}>Bekreft endringer</button>
            </div>
            <p></p>
        </div>
    )
}

export default ChangeBio;