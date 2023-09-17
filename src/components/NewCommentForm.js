import {FloatingLabel, Form} from "react-bootstrap";
import {auth, db} from "../firebaseConfig";
import {useState} from "react";
import {collection, setDoc} from "firebase/firestore";
import {doc, addDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router";


 function NewComment(props) {

    const [ text, setText ] = useState();
    const [currentUser, setCurrentUser] = useState({});
    const [comments, setComments] = useState(props.comments);

    const commentCollectionRef = collection(db, "comments");
    const navigate = useNavigate();

    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })



    const addComment = async () => {

        //Legge til kommentar i databasen
        const upload = await addDoc(commentCollectionRef, {
            content: text,
            date: todayDate(),
            userID: currentUser.uid
        });

        //Legge til kommentar-ID i kommentar-liste i aktuell opprskrift - fungerer ikke!
        const recipeDoc = doc(db, "recipes", props.id);
        
        let la = comments
        la.push(upload.id)

        setComments(la)
        await setDoc(recipeDoc, {
            comments: la
        },
        {merge: true}); 

        restartText();

        navigate("/recipepage")
    }


    const restartText = () => {
        setText("")
    }

    const todayDate = () => {
        const today = new Date()
        // Month starts at 0
        const month = today.getMonth() + 1
        // Get minutes
        const minutes = today.getMinutes() % 60;
        // Adds date to string
        const dateString = today.getFullYear() + "." + month + "." + today.getDate() + "." + today.getHours() + "." + minutes;
        return dateString;
    }


    return(
        <div>
             { currentUser !== null ? <div>
                <FloatingLabel 
                    controlId="floatingTextarea" 
                    label="Legg til en kommentar her!" 
                    className="mb-3" 
                    style={{width:"50%", marginLeft:"25%"}}>
                    <Form.Control as="textarea" placeholder="Legg til en kommentar" onChange={(event) => {setText(event.target.value)}}/>
                </FloatingLabel>
                <button onClick={addComment} disabled={!text}> Publiser </button> </div> : null}
        </div>
    )
}

export default NewComment;
