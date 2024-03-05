import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssistLogo from "../../assets/logo/logo-assist-tagline.png";
import LoginImage from "../../assets/logo/signup.png";
import styles from "./Onboarding.module.scss";
import Login from "./Login/Login";
import Register from "./Register/Register";
import useAuthProvider from "../../hooks/useAuthProvider";

const Onboarding = () => {
  const location = useLocation().pathname;
  const { id } = useParams();
  const matches = location.match(/^\/register\/employee\/(.*)$/);
  // console.log(id);
  
  const { isLoggedIn } = useAuthProvider();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);


  return (
    <div className={styles.mainContainer}>
      <div className={styles.leftSide}>
        <div className={styles.contentContainer}>
          <img
            src={AssistLogo}
            className={styles.logoImageOnboarding}
            alt="Login Logo"
          />
          <br />
          <br />

          {location === "/login" && <Login />}
          {location === "/register" && <Register/>}
          {matches && <Register id={id}/>}
        </div>
      </div>
      {/* End leftSide */}
      {/* <div className={styles.rightSide}> */}
      <img
        src={LoginImage}
        className={styles.rightImageOnboarding}
        alt="Login"
      />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default Onboarding;
