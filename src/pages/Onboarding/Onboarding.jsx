import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AssistLogo from "../../assets/logo/logo-assist-tagline.png";
import LoginImage from "../../assets/logo/signup.png";
import styles from "./Onboarding.module.scss";
import Login from "./Login/Login";
import Register from "./Register/Register";
import useAuthProvider from "../../hooks/useAuthProvider";
import pako from 'pako';

const Onboarding = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation().pathname;

  const { isLoggedIn } = useAuthProvider();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeUrlBase64Safe(encodedData) {
    // Înlocuiește caracterele pentru a face string-ul compatibil cu decodarea Base64
    let base64String = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    // Adaugă padding-ul '=' dacă este necesar
    while (base64String.length % 4) {
        base64String += '=';
    }
    return base64String;
}
  function decodeAndDecompress(data) {
    // Decodificăm datele din Base64 într-un string reprezentând datele binare comprimate
    
    // Transformă datele pentru a le face sigure pentru decodarea Base64
    const url = makeUrlBase64Safe(data);

    const decodedData = atob(url);
    // Convertim stringul într-un Uint8Array pentru a putea fi procesat de pako
    const charData = decodedData.split('').map(c => c.charCodeAt(0));
    const byteData = new Uint8Array(charData);
    // Decomprimăm datele folosind pako
    const decompressedData = pako.inflate(byteData, { to: 'string' });
    const [idOrganisation, organisationName] = decompressedData.split(":");
    return { idOrganisation, organisationName };
  }

  const [decodeOrganisation, setDecodedOrganisation] = useState({
    idOrganisation: null,
    organisationName: null
  })

  useEffect(() => {
    if (id) {
      const organisationDetails = decodeAndDecompress(id);
      setDecodedOrganisation(organisationDetails);
    }
  }, [id]);

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
          {location === "/register" && <Register decodeOrganisation={null} />}
          {location === ("/register/employee/" + id) && <Register decodeOrganisation={decodeOrganisation} />}
        </div>
      </div>
      {/* End leftSide */}
      <img
        src={LoginImage}
        className={styles.rightImageOnboarding}
        alt="Login"
      />
    </div>
  );
};

export default Onboarding;
