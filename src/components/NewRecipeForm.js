import {Controller, useForm} from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import Textarea from "react-textarea-autosize";


function RecipeForm(props) {
    const {register, handleSubmit, control} = useForm()
    let recipe = {}
    if (props.recipe != null) {
        recipe = props.recipe
    }


    /**
     * Only used for editing recipes. Loads in ingredients from props into correct format for <Select>
     */
    const ingredientList = []
    if (recipe.ingredients != null) {
        for (const ing of recipe.ingredients) {
            const x = {value: ing, label: ing}
            ingredientList.push(x)
        }
    }

    /**
     * Only used for editing recipes. Loads in ingredients from props into correct format for <Select>
     */
    const categoryList = []
    if (recipe.category != null) {
        for (const cat of recipe.category) {
            const x = {value: cat, label: cat}
            categoryList.push(x)
        }
    }

    /**
     * Categories for category dropdown menu. Value is value passed from function, label is displayed label to user.
     */
    const categoriesOptions = [
        {value: "Frokost", label: "Frokost"},
        {value: "Lunch", label: "Lunch"},
        {value: "Middag", label: "Middag"},
        {value: "Dessert", label: "Dessert"},
        {value: "Vegetar", label: "Vegetar"},
        {value: "Fisk", label: "Fisk"},
        {value: "Kylling", label: "Kylling"},
        {value: "Kjøtt", label: "Kjøtt"},
    ]

    /**
     * Default value for ingredients in dropdown-list. Possible to type in custom ingredients as well.
     */
    const ingredientsOptions = [
        {value: "Gulrøtter", label: "Gulrøtter"},
        {value: "Kjøtt", label: "Kjøtt"},
        {value: "Kylling", label: "Kylling"},
        {value: "Lam", label: "Lam"},
        {value: "Spinat", label: "Spinat"},
        {value: "Løk", label: "Løk"},
        {value: "Vann", label: "Vann"},
        {value: "Egg", label: "Egg"},
        {value: "Mel", label: "Mel"},
        {value: "Epler", label: "Epler"},
        {value: "Tomat", label: "Tomat"},
        {value: "Salat", label: "Salat"},
        {value: "Agurk", label: "Agurk"},
    ]


    return (
        <form
            onSubmit={handleSubmit((data) => {
                props.onSubmit(data)
            })}
        >
            <h3 className={"input__label"}>Oppskriftens navn: </h3>
            <input
                {...register("title", {
                    required: "title is required",
                    minLength: {
                        value: 3,
                        message: "Minimum title length is 3"
                    }
                })}
                defaultValue={recipe.title}
                type={"text"}
                className={"input__field"}
            />

            <h5 className={"input__label"}>Tidsestimat: </h5>
            <input
                {...register("timeEstimate", {
                    required: "Time estimate is required",
                    minLength: {
                        value: 1,
                        message: "Minimum time estimate is 1"
                    }
                })}
                defaultValue={recipe.timeEstimate}
                className={"input__field"}
            />

            <h5 className={"input__label"}>Antall Porsjoner: </h5>
            <input
                {...register("portions", {
                    required: "Portion count is required"
                })
                }
                type={"number"}
                defaultValue={recipe.portions}
                className={"input__field"}/>


            <h5 className={"input__label"}>Legg til bilde</h5>
            <input
                {...register("image")
                }
                type={"file"}
                className={"input__field"}
            />
            <h5 className={"input__label"}>Ingredienser: </h5>
            <Controller
                // Name specifies key in register
                name="ingredients"
                control={control}
                render={({field}) => <CreatableSelect
                    {...field}
                    // Options form const declared earlier
                    options={ingredientsOptions}
                    // Allow multiple choices
                    isMulti
                    // defines css
                    className={"input__field"}

                />}
                defaultValue={ingredientList}
                rules={{required: true}}
            />

            <h5 className={"input__label"}>Kategori: </h5>
            <Controller
                // Name specifies key in register
                name="category"
                control={control}
                render={({field}) => <Select
                    {...field}
                    // Options form const declared earlier
                    options={categoriesOptions}
                    isMulti
                    // defines css
                    className={"input__field"}

                />}
                defaultValue={categoryList}
                rules={{required: true}}
            />

            <h5 className={"input__label"}>Fremgangsmåte: </h5>
            <Textarea
                {...register("description", {
                    required: "Description is required",
                    minLength: {
                        value: 1,
                        message: "Minimum title length is 1"
                    }
                })}
                type={"textarea"}
                defaultValue={recipe.description}
                className={"input__field__big"}
            />
            <button
                type={"submit"}
                className={"input__submit"}
            >Publiser
            </button>
        </form>
    )
}

export default RecipeForm