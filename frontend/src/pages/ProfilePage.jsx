import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function AccountPage() {
    const {ready, user, setUser} = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams();
        if (subpage === undefined){
            subpage = 'profile'; // Default to 'profile' if no subpage is specified
        }

    async function logout(){
        await axios.post('/logout');
        setRedirect('/');
        setUser(null);  // Clear user state of the UserContext i.e. removing the user from the context -> profile page will not show the user anymore
    }
    
    if(!ready){
        return 'Loading...';
    }
 
    if(ready && !user && !redirect){
        // If the user is not logged in and not redirecting, navigate to the login page
        return <Navigate to={'/login'}/>
    }

    if(redirect){
    return <Navigate to={redirect}/>;
}


    return(
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                Logged in as {user.name} ({user.email})<br/>
                <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                    <PlacesPage/>
            )}
        </div>
    );
}