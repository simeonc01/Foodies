import {useEffect, useState} from "react";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {Card} from "react-bootstrap";
import "../scss/recipeCard.scss"
import {auth, db} from "../firebaseConfig";
import {collection, deleteDoc, doc, getDocs, setDoc} from "firebase/firestore";
import {onAuthStateChanged} from "firebase/auth";
import {useNavigate} from "react-router";
import React from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import {Clock} from 'react-bootstrap-icons';
import {Rating} from 'react-simple-star-rating'

function RecipeCard(props) {
    const [url, setUrl] = useState("")
    const [title] = useState(props.title)
    const [timeEstimate] = useState(props.timeEstimate)
    const [portions] = useState(props.portions)
    const [name] = useState(props.nameOfUser)
    const [category] = useState(props.category)
    const [recipeId] = useState(props.id)
    const [date] = useState(props.date)
    const [cardDate, setCardDate] = useState("");
    const [likes, setLikes] = useState("");
    const [hasLiked, setHasLiked] = useState("");
    const [favoritedByUser, setFavoritedByUser] = useState("");
    const [isFavoritedByUser, setIsFavoritedByUser] = useState("");
    const imageRef = ref(getStorage(), `images/${props.imageUrl}`);
    const [rating, setRating] = useState(0)

    const usersCollectionRef = collection(db, "users")
    const [currentUser, setCurrentUser] = useState({});
    const [admin, setAdmin] = useState(false);
    const navigate = useNavigate();

    /**
     * Sjekker om brukeren er er admin.
     * Hvis ja, så kan brukeren slette en opprskift.
     */
    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
        handleDate();
        if (currentUser !== null) {
            if (currentUser) {
                loadUser();
            } else {
                setAdmin(false);
            }
            if (likes === "") {
                updateLikes();
            }
            if (hasLiked === "") {
                setHasLiked(props.likes.includes(currentUser.uid))
            }
            if (favoritedByUser === "") {
                updateFavorites();
            }
            if (isFavoritedByUser === "") {
                setIsFavoritedByUser(props.favoritedByUser.includes(currentUser.uid))
            }
        }
    }) 


    const updateLikes = async () => {
        let n = 0;
        console.log(1);
        for (var i in props.likes) {
            if (props.likes[i] === "") {
                n += 1;
            }
        }
        setLikes(props.likes.length - n)
    }

    const updateFavorites = async () => {
        setFavoritedByUser()
    }
    /**
     * Sets rating to average rating for recipeCard
     */
    useEffect(() => {
        if (typeof props.ratings !== "undefined") {
            let sum = 0
            let count = 0
            Object.values(props.ratings).forEach(rating => {
                sum += rating
                count += 1
            })
            const avg = (sum / count) || 0;
            setRating(avg)

        }
    }, [props.ratings])

    const loadUser = async () => {
        const data = await getDocs(usersCollectionRef);
        const user = data.docs.filter(doc => doc.id === currentUser.uid).reduce((a, b) => a).data();
        setAdmin(user.admin);
    }

    const handleDate = async () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDay();
        const hour = today.getHours();
        const min = today.getMinutes();

        const array = date.split(".");

        const recipeDate = new Date(array[0], array[1] - 1, array[2], array[3], array[4])

        const difference = today - recipeDate;

        if (difference < 90000) {
            setCardDate("1 minutt siden")
        } else if (60000 < difference && difference < 3600000) {
            setCardDate(Math.round(difference / (1000 * 60)) + " minutter siden")
        } else if (3600000 < difference && difference < 86400000) {
            const d = Math.round(difference / (1000 * 60 * 60));
            if (d === 1) {
                setCardDate("1 time siden")
            } else {
                setCardDate(d + " timer siden")
            }
        } else if (86400000 < difference && difference < 604800000) {
            const d = Math.round(difference / (1000 * 60 * 60 * 24))
            if (d === 1) {
                setCardDate("1 dag siden")
            } else {
                setCardDate(d + " dager siden")
            }
        } else if (604800000 < difference && difference < 2419200000) {
            const d = Math.round(difference / (1000 * 60 * 60 * 24 * 7))
            if (d === 1) {
                setCardDate("1 uke siden")
            } else {
                setCardDate(d + " uker siden")
            }
        } else {
            const d = Math.round(difference / (1000 * 60 * 60 * 24 * 7))
            if (d === 1) {
                setCardDate("1 måned siden")
            } else {
                setCardDate(d + " måneder siden")
            }
        }
    }

    //Sletter oppskrifter
    const deleteRecipe = async (e) => {
        if (window.confirm("Er du sikker på at ønsker å slette oppskriften?")) {
            await deleteDoc(doc(db, "recipes", recipeId));
            goToRecipes();
        }
        e.stopPropagation();
    }

    const goToRecipes = async () => {
        navigate("/oppskrifter")
    }

    const liking = async (e) => {
        const recipeDoc = doc(db, "recipes", props.id);

        if (props.likes.includes(currentUser.uid)) {
            let la = props.likes
            const index = la.indexOf(currentUser.uid);
            la.splice(index, 1)
            setLikes(likes - 1);
            await setDoc(recipeDoc, {
                likes: la
            },
            {merge: true});
        } else {
            let la = props.likes
            la.push(currentUser.uid)
            setLikes(likes + 1);
            await setDoc(recipeDoc, {
                likes: la
            },
            {merge: true});
        }
        likeOrUnlike();
        //goToRecipes();
        e.stopPropagation();
    }

    /**
     *
     * @returns True if user has liked recipe
     */
    const likeOrUnlike = async () => {
        setHasLiked(props.likes.includes(currentUser.uid));
    }

    const favoriting = async (e) => {
        const recipeDoc = doc(db, "recipes", props.id);

        if (props.favoritedByUser.includes(currentUser.uid)) {
            let la = props.favoritedByUser
            const index = la.indexOf(currentUser.uid);
            la.splice(index, 1)
            setFavoritedByUser(favoritedByUser);
            await setDoc(recipeDoc, {
                favoritedByUser: la
            },
            {merge: true});
        } else {
            let la = props.favoritedByUser
            la.push(currentUser.uid)
            setFavoritedByUser(favoritedByUser);
            await setDoc(recipeDoc, {
                favoritedByUser: la
            },
            {merge: true});
        }
        favoriteOrUnfavorite();
        //goToRecipes();
        e.stopPropagation();
    }

    /**
     * 
     * @returns True if user has favorited recipe
     */
    const favoriteOrUnfavorite = async () => {
        setIsFavoritedByUser(props.favoritedByUser.includes(currentUser.uid));
    }

    /**
     * Loads correct url for image into url variable using relative path from variable imageRef. Include url in <img>
     *     component (found in return statement) to load image to page.
     */
    useEffect(() => {
            const handleDownload = async () => {
                // Create a reference to the file we want to download

                getDownloadURL(imageRef)
                    .then((url) => {
                        setUrl(url)
                    })
                    .catch((error) => {
                        // A full list of error codes is available at
                        // https://firebase.google.com/docs/storage/web/handle-errors
                        switch (error.code) {
                            case 'storage/object-not-found':
                                // File doesn't exist
                                break;
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;
                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            // ...


                            case 'storage/unknown':
                                // Unknown error occurred, inspect the server response
                                break;
                            default:
                                break;
                        }
                    });
            }
            handleDownload().then(r => console.log("image downloaded"))
        }, []
    )

    return (
        <Card className={"card recipeCard"} style={{maxWidth: '100%', maxHeight: "34rem"}}>
            <Card.Img
                style={{width: "30em", height: "20em", objectFit: "cover"}}
                variant="top" src={url}
            />
            <div className="centerIcon">
                <Card.Body style={{maxWidth: "26em"}}>
                    <Card.Title>{title}</Card.Title>
                    <Card.Subtitle> {timeEstimate}</Card.Subtitle>
                    <Card.Subtitle> {portions} porsjoner </Card.Subtitle>
                    <Card.Subtitle> Laget av {name} </Card.Subtitle>
                </Card.Body>

                {!hasLiked && 
                <div className="centerIcon" style={{marginTop:"1em"}}>
                    <AiOutlineLike 
                        onClick={(e) => liking(e)}
                        size={"1.5em"} 
                        style={{marginLeft: "2%", marginRight:"1%"}}
                    />
                    <p style={{padding:"0.05em"}}> {likes} </p>         
                </div>}

                {hasLiked && 
                <div className="centerIcon" style={{marginTop:"1em"}}>
                    <AiFillLike 
                        onClick={(e) => liking(e)}
                        size={"1.5em"} 
                        style={{marginLeft: "2%", marginRight:"1%"}}
                    />
                <p> {likes} </p> 
                </div>}

                {!isFavoritedByUser && 
                <div className="centerIcon" style={{marginTop:"1em", marginLeft:"0.8em", marginRight:"0.8em"}}>
                    <FiHeart 
                        onClick={(e) => favoriting(e)}
                        size={"1.5em"} 
                        style={{marginLeft: "2%", marginRight:"1%"}}
                    />
                    <p style={{padding:"0.05em"}}> {favoritedByUser} </p>         
                </div>}

                {isFavoritedByUser && 
                <div className="centerIcon" style={{marginTop:"1em", marginLeft:"0.8em", marginRight:"0.8em"}}>
                    <FaHeart 
                        onClick={(e) => favoriting(e)}
                        size={"1.5em"} 
                        style={{marginLeft: "2%", marginRight:"1%"}}
                    />
                <p> {favoritedByUser} </p> 
                </div>}


            </div>


            <div >
                <p style={{float: "left", marginLeft: "3%"}}>
                    <Clock size={16} style={{marginRight: "0.5em"}}/>
                    {cardDate}
                </p>
                
                <div style={{float: "right", marginRight: "3%"}}>
                    <Rating  ratingValue={rating} readonly={true} size={22}/>
                    </div>
            </div>

            <div style={{float: "left", marginLeft: "3%"}}>
                {admin &&
                    <p style={{color: "#960b0b"}}
                    onClick={(e) => deleteRecipe(e)}>Slett oppskrift?</p>}
            </div>
        </Card>


    )
}


/**
 * <Card.Body >
                <Rating ratingValue={rating} readonly={true} size={22}/>
            </Card.Body>
    {admin &&
                    <p style={{color: "#960b0b", float: "right", marginRight: "3%"}}
                       onClick={(e) => deleteRecipe(e)}>Slett oppskrift?</p>}
 */

export default RecipeCard;
