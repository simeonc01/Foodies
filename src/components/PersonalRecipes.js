import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {auth, db} from "../firebaseConfig";
import RecipeForm from "./RecipeForm";
import {onAuthStateChanged} from "firebase/auth";
import "../scss/myProfile.scss";


export default function PersonalRecipes() {

    const recipesCollectionRef = collection(db, "recipes");
    // const [recipes, setRecipes] = useState([])
    const [recipes, setRecipes] = useState([])
    const [currentUser, setCurrentUser] = useState({})

    /**
     * Loads in current user
     */
    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })

    /**
     * Loads recipes from database. Empty dependency array ( [] at the end of useEffect)
     * specifies that the function only runs once on load
     */
    useEffect(() => {
        const loadRecipes = async () => {
            const data = await getDocs(recipesCollectionRef);
            const recipes = data.docs.filter(doc => doc.data().userID === currentUser.uid).map(doc => ({...doc.data(), id: doc.id}))
            setRecipes(recipes)
        };
        loadRecipes();
        console.log("Database polled");
    }, [currentUser]);



    return (
        <div>
            <div> {recipes.length !== 0 ? 
                <div style={{marginTop:"3em", marginBottom:"2em", textAlign:"center"}}>
                                <h2>Mine oppskrifter</h2>
                                <hr style={{height:"1px", color:"black", backgroundColor:"black", width:"70%", marginLeft:"15%"}}/>
                </div> : null}
            </div>
            <div className = "container-3">
                <RecipeForm recipes={recipes}/>
            </div>
        </div>
    )
}