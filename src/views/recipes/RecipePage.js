import RecipeCard from "../../components/RecipeCard";
import {useEffect, useState} from "react";
import IngredientList from "../../components/IngredientList";
import {Card} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router";
import "../../scss/recipePage.scss";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../../firebaseConfig";
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import {Modal} from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import UpdateRecipe from "./UpdateRecipe";
import {Rating} from 'react-simple-star-rating'
import NewComment from "../../components/NewCommentForm";
import Comment from "../../components/Comment";


function RecipePage() {
    // Had to use an empty array to create child react elements, or else they get set to null
    const [recipe, setRecipe] = useState([])
    //const [user, setUser] = useState([])
    const [rating] = useState(recipe.rating) // initial rating value
    const {state} = useLocation()
    const [showEditButton, setShowEditButton] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showVisitButton, setShowVisitButton] = useState(true);


    const [currentUserID, setCurrentUserID] = useState({});
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null)


    /**
     * Loads in current user
     */
    onAuthStateChanged(auth, (user) => {
        try {
            setCurrentUser(user)
            setCurrentUserID(currentUser.uid)
    
            if (currentUser !== null) {
                if (currentUser.uid === state.recipe.userID) {
                    setShowEditButton(true)
                    setShowVisitButton(false)
                }
            } 
        } catch (error) {
            console.log(error)
        }
    })
    /**
     * Sets recipe from received props value. Only runs once on first render.
     */
    useEffect(() => {
        setRecipe([state.recipe])
    }, [])

    /**
     * Displays editor window
     */
    const handleEdit = () => {
        setShowEditor(true)
        console.log("knapp trykket på")
        console.log(recipe)
    }


    const goToProfilePage = async () => {
        navigate("/profilePage")
    }

    const goToSeeProfile = async (userID) => {
        navigate("/seeProfile", {state: {userID: userID}})
    }

    const handleDelete = async () => {
        if (window.confirm("Er du sikker på at du ønsker å slette oppskriften din? Denne handlingen kan ikke angres.")) {
            await deleteDoc(doc(db, "recipes", state.recipe.id));
            console.log("Oppskriften ble slettet!")
            goToProfilePage()
        }
    }

    const handleVisit = async () => {
        goToSeeProfile(state.recipe.userID)
    }

    const onCloseModal = () => {
        setShowEditor(false)
    };

    /**
     * Handles rating when clicking rating
     * @param rating taken from stars. Numbers 0-100
     */
    const handleRating = async (rating) => {
        const recipeDoc = doc(db, "recipes", state.recipe.id);
        let newRatings = []
        if (typeof state.recipe.ratings === "undefined") {
            newRatings = {[currentUser.uid]: rating}
        } else {
            newRatings = {...state.recipe.ratings, [currentUser.uid]: rating}
        }
        console.log(newRatings)
        // await db.collection("recipes").doc(recipe.id).collection("ratings").add({currentUser: rating})

        await setDoc(recipeDoc, {
                ratings: newRatings
            },
            // Merges in data if document exists
            {merge: true});
        console.log("Rating uploaded")
    }

    return (
        <div>
            {recipe.map(recipe => {
                return (
                    <div>
                        <div key={recipe.id + "1"} className={"container-2"}>
                            {/*Editor that loads all current values as props in the newRecipe element. Hidden until user
                            starts editing the current recipe.
                            */}
                            <Modal open={showEditor} onClose={onCloseModal}>
                                <div>{showEditor ?
                                    <UpdateRecipe
                                        recipe={recipe}
                                    /> : null}
                                </div>
                            </Modal>
                            <RecipeCard 
                                title={recipe.title}
                                timeEstimate={recipe.timeEstimate}
                                portions={recipe.portions}
                                nameOfUser={recipe.nameOfUser}
                                category={recipe.category}
                                ratings={recipe.ratings}
                                imageUrl={recipe.imageUrl}
                                id={recipe.id}
                                date={recipe.date}
                                likes={recipe.likes}
                                favoritedByUser={recipe.favoritedByUser}
                                style={{margin: "10rem"}}
                                key={recipe.id}
                            />
                            <div>
                                <IngredientList 
                                    key={recipe.id + "ingredients"}
                                    ingredients={recipe.ingredients}
                                    description={recipe.description}
                                />
                                <Card style={{width: "35rem", marginTop: "2em"}}>
                                    <Card.Body>
                                        <Card.Title>Fremgangsmåte: </Card.Title>
                                        <Card.Text>
                                            {recipe.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                <Card style={{width: "48%", marginTop: "2em", marginLeft:"26%"}}> 
                                    <Card.Body>
                                        <Card.Title>Vurder denne oppskriften</Card.Title>
                                        <Rating onClick={handleRating} ratingValue={rating}/>
                                    </Card.Body>
                                </Card>
                        
                                <div className="centerButtons" style={{marginTop:"2em"}}>
                                    {showEditButton ?
                                        <button onClick={handleEdit}>Rediger oppskrift</button> : null}
                                    {showEditButton ?
                                        <button onClick={handleDelete}>Slett oppskrift</button> : null}
                                    {showVisitButton ?
                                        <button onClick={handleVisit}>Besøk profil</button> : null}
                                </div>
                            </div>
                        </div>
                        <div style={{marginTop:"3em", marginBottom:"2em", textAlign:"center"}}>
                            <h3>Kommentarfelt</h3>
                            <hr style={{height:"1px", color:"black", backgroundColor:"black", width:"70%", marginLeft:"15%"}}/>
                            <Comment
                                id={recipe.id}
                                title={recipe.title}
                                userID={currentUserID}
                                comments={recipe.comments}
                            />
                            <NewComment
                                id={recipe.id}
                                title={recipe.title}
                                userID={currentUserID}
                                comments={recipe.comments}
                            />
                        </div>
                    </div>
                    
                )
            })}

            

        </div>


    )
}

export default RecipePage;