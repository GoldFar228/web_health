import { useEffect, useState } from "react";
import "./HomePage.css"
// import TaskComponent from "../../../components/TaskComponent/TaskComponent";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import LandingPage from "../LandingPage/LandingPage";
import Dashboard from "../../../components/Dashboard/Dashboard";
import { useProfile } from "../../../hooks/useProfile";
import { useAuthSync } from "../../../hooks/useAuthSync";

function HomePage() {
  const dispatch = useDispatch();
  const { profile, isLoading } = useProfile();
  const isAuthenticated = useAuthSync();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  const shouldShowDashboard = isAuthenticated && !!profile;
  
  return (
    <div>
      {shouldShowDashboard ? <Dashboard /> : <LandingPage />}
    </div>
  );
}


export default HomePage;