import {useState, useEffect} from "react";
import {auth, db} from "../firebaseConfig";
import {collection, getDocs} from "firebase/firestore";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {useNavigate} from "react-router";
import PersonalRecipes from "../components/PersonalRecipes";



function MyProfile() {
    const usersCollectionRef = collection(db, "users")
    const [email, setEmail] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastName, setLastName] = useState("")
    const [bio, setBio] = useState("")
    const [imageURL, setImageURL] = useState("")
    const [favoriteRecipes, setFavoriteRecipes] = useState("")

    const [currentUser, setCurrentUser] = useState({});


    onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
    })

    useEffect(() => {
        if (currentUser !== null) {
            loadUser();
        }
    }, [currentUser])



    const logout = async () => {
        if (window.confirm("Er du sikker på at ønsker å logge ut?")) {
            await signOut(auth);
            goToLogin();
        }
    }

    const navigate = useNavigate();

    const goToLogin = async () => {
        navigate("../registration/login")
    }

    const goToEditProfile = async () => {
        navigate("/editProfile")
    }

    const loadUser = async () => {
        try {
            console.log("heiqweoiwqeiqwie0qi")
            const data = await getDocs(usersCollectionRef);
            const user = data.docs.filter(doc => doc.id === currentUser.uid).reduce((a, b) => a).data();
            setEmail(user.email);
            setFirstname(user.firstName);
            setLastName(user.lastName);
            setFavoriteRecipes(user.favoriteRecipes);
            if (user.bio === "") {
                setBio("(Ingen bio)");
            } else {
                setBio(user.bio);
            }
            if (user.profilePictureURL === currentUser.uid) {
                handleDownloadImage();
            } else {
                handleDownloadDefault();
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDownloadImage = async () => {
        const imageRef = ref(getStorage(), 'profilePictures/' + currentUser.uid + '.png');
        getDownloadURL(imageRef)
            .then((url) => {
                setImageURL(url)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const handleDownloadDefault = async () => {
        const imageRef = ref(getStorage(), 'profilePictures/' + "default.png");
        getDownloadURL(imageRef)
            .then((url) => {
                setImageURL(url)
            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    // const handleFavoriteRecipes = async () => {
    //     const data = await getDocs(usersCollectionRef);
    //     const user = data.docs.filter(doc => doc.id === currentUser.uid).reduce((a, b) => a).data();  

    //     if (user.favoriteRecipes === "") {
    //         setFavoriteRecipes("Du har ikke valgt noen favorittoppskrifter enda.");
    //     } else {
    //         setFavoriteRecipes(user.favoriteRecipes);
    //     };
    // }


    return (
        <div>
            <div className="centerButtons">
                <Card style={{width: '19rem'}}>
                    <Card.Img variant="top" src={imageURL} className="profileImage"/>
                    <Card.Body>
                        <Card.Text> <em>{bio}</em> </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>E-post: {email}</ListGroupItem>
                        <ListGroupItem>Fornavn: {firstname} </ListGroupItem>
                        <ListGroupItem>Etternavn: {lastName}</ListGroupItem>
                    </ListGroup>
                </Card>
            </div>
            <div className="centerButtons">
                <button onClick={goToEditProfile}>
                    Endre profil
                </button>
                <button onClick={logout} type="signOut">
                    Logg ut
                </button>
            </div>
            <PersonalRecipes/>
        </div>
    )
}

export default MyProfile;