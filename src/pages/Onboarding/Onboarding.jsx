import React from "react";
import { useLocation, useParams } from "react-router-dom";
import AssistLogo from "../../assets/logo/logo-assist-tagline.png";
import LoginImage from "../../assets/logo/signup.png";
import style from "./Onboarding.module.scss";
import Login from "./Login/Login";
import Register from "./Register/Register";

const Onboarding = () => {
  const location = useLocation().pathname;
  const { id } = useParams();
  const matches = location.match(/^\/register\/employee\/(.*)$/);
  console.log(id);
  return (
    <div className={style.mainContainer}>
      <div className={style.leftSide}>
        <div className={style.contentContainer}>
          <img
            src={AssistLogo}
            className={style.logoImageOnboarding}
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
      {/* <div className={style.rightSide}> */}
      <img
        src={LoginImage}
        className={style.rightImageOnboarding}
        alt="Login"
      />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default Onboarding;
