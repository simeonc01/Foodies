import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebaseConfig";
import RecipeForm from "../components/RecipeForm";
import {Categories} from "../components/Categories";
import "../scss/recipeForm.scss";
import {
    FormControl,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField
} from "@material-ui/core"


export default function Recipes() {
    const recipesCollectionRef = collection(db, "recipes");
    const [recipes, setRecipes] = useState([])
    const [allRecipes, setAllRecipes] = useState([])
    const [category, setCategory] = useState([]); //Array som fyller/tømmer seg når knappene er på/av


    const handleChange = e => { //fyller/tømmer category-array når en knapp blir slått på/av
        if (e.target.checked) {
            setCategory([...category, e.target.value]);
        } else {
            setCategory(category.filter(id => id !== e.target.value));
        }
    }

    useEffect(() => {
        if (category.length === 0) {
            setRecipes(allRecipes)
        } else {
            setRecipes( //går gjennom alle oppskriftene og filtrerer i forhold til hvilke kategorier som finnes i category.
                allRecipes.filter(categories =>
                    category.some(i => [categories.category].flat().includes(i))
                )
            );
        }
    }, [category]) //props.recipes er inkludert fordi den vil laste inn alle oppskriftene første gangen. category er inkludert siden den oppdateres for hvert knappetrykk

    /**
     * Loads recipes from database. Empty dependency array ( [] at the end of useEffect)
     * specifies that the function only runs once on load
     */
    useEffect(() => {
        const loadRecipes = async () => {
            const data = await getDocs(recipesCollectionRef);
            const allRecipes = data.docs.map((doc) => ({...doc.data(), id: doc.id}));
            setAllRecipes(allRecipes)
            setRecipes(allRecipes)
        };
        loadRecipes();
        console.log("Database polled");
    }, []);


    return (
        <div >
            <div class = "split right" className = "container-recipeFeedOrigin">  
                <RecipeForm recipes={recipes}/>
            </div>
            <div class="split left" >
                <FormControl>
                    <FormGroup>
                        {Categories.map(categories => ( //lager knapper for alle kategoriene som er oppgitt i categories.js-filen
                            <FormControlLabel
                                control={<Checkbox onChange={handleChange}/>}
                                label={categories.category}
                                value={categories.category}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </div>
        </div>

    )
}