import { useState, useEffect } from "react";
import {collection, getDocs} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import {Card, Button} from "react-bootstrap";




function CommentForm(props) {

    const commentCollectionRef = collection(db, "comments");
    const usersCollectionRef = collection(db, "users");

    const [ id ] = useState(props.id) 
    const [ content, setContent ] = useState("")
    const [ userID, setUserID] = useState("");
    const [ firstName, setFirstName] = useState("");
    const [ lastName, setLastName] = useState("");




    useEffect(() => {
        loadComment()
        
    }, [])

    const loadComment = async () => {
        const commentData = await getDocs(commentCollectionRef);
        const userData = await getDocs(usersCollectionRef);
        console.log(id)
        try {
            const d1 = commentData.docs.filter(doc => doc.id === id).reduce(a => a).data();
            setContent(d1.content)
            setUserID(d1.userID)

            
            const d2 = userData.docs.filter(doc => doc.id === d1.userID).reduce(a => a).data();
            setFirstName(d2.firstName)
            setLastName(d2.lastName)
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <div>
            <Card style={{width:"40%", marginLeft:"30%", marginTop:"1em", marginBottom:"2em", borderBlockWidth:"0.01em"}}>
                <Card.Header style={{textAlign:"left"}}>
                    <Card.Title> {firstName} {lastName} </Card.Title>
                </Card.Header>
                <Card.Body style={{textAlign:"left"}}>
                    <Card.Text>
                        {content} 
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}
export default CommentForm;
