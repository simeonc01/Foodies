import {useNavigate} from "react-router";


function EditProfile() {
    
    const navigate = useNavigate();
    
    const goToChangeProfilePicture = async () => {
        navigate("/changeprofilepicture")
    }

    const goToChangePassword = async () => {
        navigate("/changepassword")
    }

    const goToChangeBio = async () => {
        navigate("/changebio")
    }

    const goToDeleteUser = async () => {
        navigate("/deleteuser")
    }

    const goToProfilePage = async () => {
        navigate("/myprofile")
    }

    
    return(
        <div className="centered" >
            <p></p>
            <div className="test">
                <button type="profile" onClick={goToChangePassword}>
                    Endre passord
                </button>
                <p></p>
                <button type="profile" onClick={goToChangeBio}>
                    Endre bio
                </button>
                <p></p>
                <button type="profile" onClick={goToChangeProfilePicture}>
                    Endre profilbilde
                </button>
                <p></p>
                <button type="profile" onClick={goToDeleteUser}>
                    Slett min profil
                </button>
                <p></p>
                <button type="profileCancel" onClick={goToProfilePage}>
                    Avbryt
                </button>
            </div>
        </div>
    )
}

export default EditProfile;