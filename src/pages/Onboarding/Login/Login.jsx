import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";

import { ReactComponent as View } from "../../../assets/icons/view.svg";
import { ReactComponent as ViewOff } from "../../../assets/icons/view-off.svg";

import useAuth from "../../../hooks/useAuth";
import useStateProvider from "../../../hooks/useStateProvider";

import { login } from "../../../api/API";
import Input from "../../../components/input/Input";
import Button from "../../../components/Button/Button";
import { jwtDecode } from "jwt-decode";


const Login = () => {
  const { setUser, rememberMe, setRememberMe } = useAuth();
  const { setAlert } = useStateProvider();
  const navigate = useNavigate();

  // const { setUser } = useAuth();
  const [passwordShown, setPasswordShown] = useState(true);

  // form values
  const [email, setEmail] = useState(""); // ""
  const [pwd, setPwd] = useState(""); // ""

  // error states
  const [emailError, setEmailError] = useState(null);
  const [pwdError, setPwdError] = useState(null); 

  const handleEmailError = (e) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(e) === false) {
      setEmailError("Invalid e-mail address!");
    } else {
      setEmailError("");
    }
  };


  const handlePwdError = (e) => {
    if (e.length < 7) {
      setPwdError("The password must be atleast 7 characters long!");
    } else setPwdError("");
  };

  const handleLogin = async () => {
    try {
      if (emailError === "" && pwdError === "") {
        if (pwd.length > 6) {
          console.log(email, pwd);
          const response = await login(email, pwd);
          if (response !== null) {
            const decodedToken = jwtDecode(response.data.jwt);

            if (rememberMe) localStorage.setItem('token', response.data.jwt);
            else sessionStorage.setItem('token', response.data.jwt);

            setUser(decodedToken);
            console.log(decodedToken);
            navigate("/");

            setAlert({
              type: "success",
              message: "Login successfully",
            });
          }
          else {
            setAlert({
              type: "danger",
              message: "Something went wrong! Check your credentials",
            });
          }
        }
      } else {
        if (emailError !== "") handleEmailError("");
        if (pwdError !== "") handlePwdError("");
        setAlert({
          type: "danger",
          message: "Fill all the required fields correctly.",
        });
      }
    } catch (error) {
      console.log(error.message, "error");
      setAlert({
        type: "danger",
        message: error.message || "Something went wrong...", // Use the error message from the catch
      });
    }
  };

  const passToggleHandler = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles.auth}>
      <div className={styles.containerAuth}>
        <div className={styles.contentContainerForm}>
          <div className={styles.form}>
            <div className={styles.formTitle}>
              <h4 className={styles.title}>Login</h4>
              <p className={styles.subTitle}>Insert your credentials.</p>
            </div>

            <div className={styles.formInput}>
              {/* email */}
              {emailError && <div className={styles.authError}>{emailError}</div>}
              <Input
                label="Email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleEmailError(e.target.value);
                }}
                type="email"
                placeholder={"Email"}
                required
              />

              {/* password */}
              {pwdError && <div className={styles.authError}>{pwdError}</div>}
              <Input
                label="Password"
                id="password"
                name="password"
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                  handlePwdError(e.target.value);
                }}
                type={passwordShown ? "password" : "text"}
                placeholder={"Password"}
                icon={passwordShown ? <View /> : <ViewOff />}
                onIconClick={passToggleHandler}
                required
              />
            </div>
          </div>

          <div className={styles.rememberMe}>
            <div
              className={styles.checkBox}
              type="button"
              onClick={(e) => setRememberMe(!rememberMe)}
            >
              <Input
                type="checkbox"
                label=""
                value={rememberMe}
                checked={rememberMe}
                onClick={(e) => setRememberMe(!rememberMe)}
              />
              <p className={styles.textRememberMe}>Remember me!</p>
            </div>

            {/* <div className={styles.forgotPassword}>
              <span
                className={styles.textForgotPassword}
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                Ai uitat parola?
              </span>
            </div> */}
          </div>
        </div>

        <div className={styles.contentContainerAuthOptions}>
          <div className={styles.contentContainerButtons}>
            <Button variant="primary" label="Login" onClick={handleLogin} />
          </div>
          <div className={`${styles.contentContainerAuthEndForm} ${styles.authRegister}`}>
            <div className={styles.textAuthEndForm}>
              Register organisation?{" "}
              <span
                className={styles.textAuthEndForm}
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;