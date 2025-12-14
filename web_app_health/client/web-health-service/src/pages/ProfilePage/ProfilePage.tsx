import { useState } from "react";
import "./ProfilePage.css"
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import ProfileComponent from "../../components/RegisterComponent/ProfileComponent";

function ProfilePage() {
    
    return (
        <>
            <HeaderComponent />
            <ProfileComponent />
        </>
    );
}


export default ProfilePage;