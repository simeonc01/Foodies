import {auth, db} from "../firebaseConfig";
import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";
import CommentForm from "./CommentForm"


 function Comment(props) {

    
    const commentCollectionRef = collection(db, "comments");

    const [comments, setComments] = useState(props.comments)

    const [selectedComments, setSelectedComments] = useState([])
    const [currentUser, setCurrentUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })


    useEffect(() => {
        setComments(props.comments)
        comments.forEach(async element => {
            try {
                const data = await getDocs(commentCollectionRef);
                const d = data.docs.reduce(a => a).data();
                var array = selectedComments;
                if (array.indexOf(d) !== -1) {
                    array.push(d)
                    setSelectedComments(array)
                }
            } catch (error) {
                console.log(error)
            }
        });
    }, [currentUser])
    

    /*
    const loadComment = async (c) => {
        const data = await getDocs(commentCollectionRef);
        try {
            const d = data.docs.filter(doc => doc.id === c).reduce((a, b) => a).data();
            
        } catch (error) {
            console.log(error)
            console.log("nei")
        }
    } */



    return(
        <div >
            {comments.map(c => {
                
                return (
                    <CommentForm id={c}/>
                )

            })

            }


        </div>
    )
}

/*
<Card style={{width:"40%", marginLeft:"30%", marginTop:"1em", marginBottom:"2em", borderBlockWidth:"0.01em"}}>
                <Card.Header style={{textAlign:"left"}}>
                    <Card.Title>Navn: {com.content}  </Card.Title>
                </Card.Header>
                <Card.Body style={{textAlign:"left"}}>
                    <Card.Text>
                        Beskrivelse: 
                    </Card.Text>
                </Card.Body>
            </Card>

*/

export default Comment;
