/* eslint-disable no-useless-escape */
import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import useStateProvider from "../../../hooks/useStateProvider";
import styles from "./Register.module.scss";
import Button from "../../../components/Button/Button";
import { registerAdmin, registerUser } from "../../../api/API";
import RegisterAdmin from "./RegisterAdmin";
import RegisterUser from "./RegisterUser";
import { jwtDecode } from "jwt-decode";

const Register = ({id}) => {
    
    const navigate = useNavigate();
    let decodedToken;
    if (id) {
        try {
            decodedToken = jwtDecode(id);
        } catch (error) {
            console.error("Eroare la decodarea JWT", error);
            // Manevrează eroarea corespunzător (de exemplu, redirectează utilizatorul)
        }
    }

    const { setAlert } = useStateProvider();

    const [passwordShown, setPasswordShown] = useState(true);

    const [formValue, setFormValue] = useState({
        firstName: "",
        lastName: "",
        eMailAdress: "",
        password: "",
        //! organisationName is used for idOrganisation ONLY in case of [employee register]
        organisationName: id === undefined ? "" : decodedToken?.idOrganisation,
        headquarterAddress: "",
    });

    // show errors only if clicked to submit
    const [showErrors, setShowErrors] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => {
            return { ...prev, [name]: value };
        });
    };
    const passToggleHandler = () => {
        setPasswordShown(!passwordShown);
    };
    const checkErrors = (field) => {
        // firstName
        if (field === "firstName") {
            if (formValue.firstName.length < 3 && formValue.firstName.length > 0) {
                return "First name must have at least 3 characters!";
            } else if (formValue.firstName.length === 0) {
                return "This field is mandatory!";
            }
        }
        // lastName
        if (field === "lastName") {
            if (formValue.lastName.length < 3 && formValue.lastName.length > 0) {
                return "Last name must have at least 3 characters!";
            } else if (formValue.lastName.length === 0) {
                return "This field is mandatory!";
            }
        }

        // email
        if (field === "eMailAdress") {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (formValue.eMailAdress.length === 0)
                return "This field is mandatory!";
            else if (reg.test(formValue.eMailAdress) === false)
                return "Email address is invalid!";
        }

        // password
        if (field === "password") {
            if (formValue.password.length < 8)
                return "Password must have at least 8 characters!";
        }
        if (id === undefined) {
            // organisationName
            if (field === "organisationName") {
                if (formValue.organisationName.length < 5 && formValue.organisationName.length > 0) {
                    return "The name must have at least 5 characters!";
                } else if (formValue.organisationName.length === 0) {
                    return "This field is mandatory!";
                }
            }

            // headquarterAddress
            if (field === "headquarterAddress") {
                if (formValue.headquarterAddress.length < 7 && formValue.headquarterAddress.length > 0) {
                    return "The address must have at least 7 characters!";
                } else if (formValue.headquarterAddress.length === 0) {
                    return "This field is mandatory!";
                }
            }

        }

        return "";
    };

    // check if form is valid
    const isFormValid = () => {
        let isValid = true;
        Object.keys(formValue).forEach((field) => {
            if (checkErrors(field)) {
                isValid = false;
            }
        });
        return isValid;
    };

    // handle register
    const handleRegister = async () => {
        if (!isFormValid()) {
            setShowErrors(true);
            setAlert({
                type: "danger",
                message: "Fill all the required fields correctly.",
            });
        }
        if (isFormValid()) {
            setShowErrors(false);
            try {
                const response = id === undefined ? await registerAdmin(formValue) : await registerUser(formValue);
                if (response.status === 200) {
                    navigate("/login");
                    setAlert({
                        type: "success",
                        message: "Your account was succesfully created!",
                    });
                }
            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...", // Use the error message from the catch
                });
            }
        }
    };

    // console.log(decodedToken);
    return (

        <div className={styles.auth}>
            <div className={styles.containerAuth}>
                <div className={styles.contentContainerForm}>
                    {id !== undefined ?
                        <RegisterUser decodedToken={decodedToken} formValue={formValue} handleChange={handleChange} showErrors={showErrors} checkErrors={checkErrors} passwordShown={passwordShown} passToggleHandler={passToggleHandler} />
                        :
                        <RegisterAdmin formValue={formValue} handleChange={handleChange} showErrors={showErrors} checkErrors={checkErrors} passwordShown={passwordShown} passToggleHandler={passToggleHandler} />
                    }
                </div>
                <div className={styles.contentContainerAuthOptions}>
                    <div className={styles.contentContainerButtons}>
                        <Button
                            id="register"
                            variant="primary"
                            label="Sign up"
                            onClick={handleRegister}
                        />
                    </div>

                    {!id &&
                        <div
                            className={`${styles.contentContainerAuthEndForm} ${styles.authRegister}`}
                        >
                            <div className={styles.textAuthEndForm}>
                                Already have an account?{" "}
                                <span
                                    className={styles.textAuthEndForm}
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    Log in
                                </span>
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    );
}
export default Register;