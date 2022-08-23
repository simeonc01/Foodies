import NewRecipeForm from "../components/NewRecipeForm";
import {onAuthStateChanged} from "firebase/auth";
import {auth, db} from "../firebaseConfig";
import {useState, useEffect} from "react";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {useNavigate} from "react-router";
import "../scss/newRecipe.scss"


function NewRecipe() {
    const usersCollectionRef = collection(db, "users")
    const recipesCollectionRef = collection(db, "recipes");

    // const [image, setImage] = useState(null)
    const [currentUser, setCurrentUser] = useState({})
    const [nameOfUser, setNameOfUser] = useState("Ukjent")

    const navigate = useNavigate();


    /**
     * Loads in current user
     */
    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
        loadNameOfUser().then()
    })


    /**
     * Sets nameOfUser to "firstName lastName" of current user
     * @return {Promise<void>}
     */
    const loadNameOfUser = async () => {
        const data = await getDocs(usersCollectionRef);
        const user = data.docs.filter(doc => doc.id === currentUser.uid).reduce((a, b) => a).data();
        setNameOfUser(user.firstName + " " + user.lastName);
        console.log(user.firstName + " " + user.lastName)
    }

    /**
     * Uploads new recipe to firebase
     * @return {Promise<void>}
     */
    const submitData = async (data) => {
        const ingredients = []
        const category = []
        const today = new Date()
        // Month starts at 0
        const month = today.getMonth() + 1
        // Get minutes
        const minutes = today.getMinutes() % 60;
        // Adds date to string
        const dateString = today.getFullYear() + "." + month + "." + today.getDate() + "." + today.getHours() + "." + minutes;


        let imageUrl = "blank.png"
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
        if (data.image[0] != null) {
            await uploadImage(data.image[0])
            imageUrl = data.image[0].name
        }
        // Adds recipeFeed to doc. All fields are marked as required so all fields should be filled.
        await addDoc(recipesCollectionRef, {
            title: data.title,
            timeEstimate: data.timeEstimate,
            portions: data.portions,
            ingredients: ingredients,
            category: category,
            description: data.description,
            imageUrl: imageUrl,
            date: dateString,
            userID: currentUser.uid,
            nameOfUser: nameOfUser,
            likes: [],
            favoritedByUser: [],
            comments: []
        });
        console.log("Recipe uploaded to database")
        navigate("/oppskrifter")
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
        <div className={"center"}>
            <div className={"newRecipe"}>
                <NewRecipeForm
                    onSubmit={submitData}
                />
            </div>
        </div>
    )
}

export default NewRecipe;