import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssistLogo from "../../assets/logo/logo-assist-tagline.png";
import LoginImage from "../../assets/logo/signup.png";
import styles from "./Onboarding.module.scss";
import Login from "./Login/Login";
import Register from "./Register/Register";
import useAuthProvider from "../../hooks/useAuthProvider";

const Onboarding = () => {
  // debugger
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation().pathname;
  let regex = /^eyJhbGciOiJSUzI1NiJ9./;

  const { isLoggedIn } = useAuthProvider();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (regex.test(id) === false && (location !== "/login" && location !== "/register"))
      navigate('/not-found', { replace: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          {location === "/register" && <Register />}
          {location === ("/register/employee/" + id) && <Register id={id} />}
          {/* {jwtid && <Register id={id} />} */}
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
