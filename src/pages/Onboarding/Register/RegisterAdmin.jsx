import React from 'react'

import styles from "./Register.module.scss";
import Input from "../../../components/input/Input";

import { ReactComponent as View } from "../../../assets/icons/view.svg";
import { ReactComponent as ViewOff } from "../../../assets/icons/view-off.svg";

const RegisterAdmin = ({ formValue, handleChange, showErrors, checkErrors, passwordShown, passToggleHandler }) => {
  return (
    <div className={styles.form}>
      <div className={styles.formTitle}>
        <h4 className={styles.title}>Create account</h4>
        <p className={styles.subTitle}>
          Sign up for free and register your organisation
        </p>
      </div>

      <div className={styles.formInput}>

        <Input
          type="text"
          placeholder={"First name"}
          required
          label="First name *"
          id="firstName"
          name="firstName"
          value={formValue.firstName}
          onChange={handleChange}
          error={showErrors && checkErrors("firstName") ? true : false}
          helper={showErrors ? checkErrors("firstName") : ""}
        />

        <Input
          type="text"
          placeholder={"Last name"}
          required
          label="Last name *"
          id="lastName"
          name="lastName"
          value={formValue.lastName}
          onChange={handleChange}
          error={showErrors && checkErrors("lastName") ? true : false}
          helper={showErrors ? checkErrors("lastName") : ""}
        />

        <Input
          type="email"
          placeholder={"Email"}
          required
          label="Email *"
          id="eMailAdress"
          name="eMailAdress"
          value={formValue.eMailAdress}
          onChange={handleChange}
          error={showErrors && checkErrors("eMailAdress") ? true : false}
          helper={showErrors ? checkErrors("eMailAdress") : ""}
        />


        <Input
          type={passwordShown ? "password" : "text"}
          placeholder={"Password"}
          required
          label="Password *"
          id="password"
          name="password"
          value={formValue.password}
          onChange={handleChange}
          error={showErrors && checkErrors("password") ? true : false}
          helper={showErrors ? checkErrors("password") : ""}
          icon={passwordShown ? <View /> : <ViewOff />}
          onIconClick={passToggleHandler}
        />
        <span className={styles.textpwdInfo}>
          At least 8 characters.
        </span>

        <Input
          type="text"
          placeholder={"Organization name"}
          required
          label="Organization name *"
          name="organisationName"
          id="organisationName"
          value={formValue.organisationName}
          onChange={handleChange}
          error={showErrors && checkErrors("organisationName") ? true : false}
          helper={showErrors ? checkErrors("organisationName") : ""}
        />

        <Input
          type="text"
          placeholder={"Headquarter Address"}
          required
          label="Headquarter Address *"
          id="headquarterAddress"
          name="headquarterAddress"
          value={formValue.headquarterAddress}
          onChange={handleChange}
          error={showErrors && checkErrors("headquarterAddress") ? true : false}
          helper={showErrors ? checkErrors("headquarterAddress") : ""}
        />
      </div>
    </div>
  )
}

export default RegisterAdmin