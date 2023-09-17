import NewRecipeForm from "../../components/NewRecipeForm";
import {doc, setDoc} from "firebase/firestore";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {db} from "../../firebaseConfig";
import {useNavigate} from "react-router";
import "../../scss/updateRecipe.scss"


function UpdateRecipe(props) {

    const recipeDoc = doc(db, "recipes", props.recipe.id);
    const navigate = useNavigate();
    


    /**
     * Updates recipe with new fields from <RecipeForm>
     * @param data New fields from <RecipeForm> that user has entered
     * @return {Promise<void>}
     */
    const updateRecipe = async (data) => {
        const ingredients = []
        const oldRecipe = props.recipe
        const category = []
        const today = new Date()

        // Month starts at 0
        const month = today.getMonth() + 1

        // Get minutes
        const minutes = today.getMinutes() % 60;

        // Adds date to string
        const dateString = today.getFullYear() + "." + month + "." + today.getDate() + "." + today.getHours() + "." + minutes;

        // ingredients are returned as an IterableIterator so loop is used to extract only ingredients and add them
        // to collection
        for (let ing of data.ingredients.entries()) {
            ingredients.push(ing[1].value)
        }
        for (let cat of data.category.entries()) {
            category.push(cat[1].value)
        }
        // uploads image if present and sets imageUrl accordingly, which will be stored with recipe. data.image is passed
        // as FileList so need to check data.image[0]
        let imageUrl = ""
        if (data.image[0] != null) {
            await uploadImage(data.image[0])
            imageUrl = data.image[0].name
        } else {
            imageUrl = oldRecipe.imageUrl
        }
        // Adds recipeFeed to doc. All fields are marked as required so all fields should be filled.
        await setDoc(recipeDoc, {
                title: data.title,
                timeEstimate: data.timeEstimate,
                portions: data.portions,
                ingredients: ingredients,
                category: category,
                description: data.description,
                imageUrl: imageUrl,
                date: dateString,
            },
            // Merges in data if document exists
            {merge: true});
        console.log("Recipe updated")
        navigate("/recipes")
        // window.location.reload()

    }

    /**
     * Uploads image to storage in firebase
     * @return {Promise<void>}
     */
    const uploadImage = async (image) => {
        const storage = getStorage();
        const storageRef = ref(storage, `/images/${image.name}`);
        uploadBytes(storageRef, image).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }

    return (
        <div>
            <NewRecipeForm
                recipe={props.recipe}
                onSubmit={updateRecipe}
            />
        </div>
    )
}

export default UpdateRecipe