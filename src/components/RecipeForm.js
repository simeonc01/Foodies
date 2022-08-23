import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebaseConfig";
import RecipeCard from "../components/RecipeCard";
import "../scss/recipeForm.scss"


function RecipeForm(props) {
    // Constants used in function
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)

    let recipe = {}
    if (props.recipe != null) {
        recipe = props.recipe
    }


    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })

    /**
     * Loads recipes that are passed as props from parent element (MainRecipeFeed / PersonalRecipeFeed)
     */
    useEffect(() => {
        setRecipes(props.recipes)
    }, [props.recipes])


    /**
     * Navigates to /displayRecipe and passes clicked recipe as a prop to recipePage
     */
    const handleRecipeClicked = (recipe) => {
        if (currentUser !== null) {
            navigate("/recipepage", {state: {recipe: recipe}})
        }
        
    }


    return (
        <div className = "container-1">
            {recipes.length !== 0 &&
            recipes.map((recipe) => {
                return (
                    <div onClick={() => handleRecipeClicked(recipe)} key={recipe.id + "1"}>
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
                            name={recipe.nameOfUser || "Ukjent"}
                            style={{margin: "10rem"}}
                            key={recipe.id}
                        /></div>)

            })}
        </div>
    )

}

export default RecipeForm