import React, { useState } from 'react'
import RowItem from '../../components/RowItem/RowItem'
import useAuthProvider from '../../hooks/useAuthProvider';
import useStateProvider from '../../hooks/useStateProvider';
import Input from "../../components/input/Input";
import Button from "../../components/Button/Button";
import styles from "./Profile.module.scss"
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineLocalPolice } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { Col, Container, Row } from 'react-bootstrap';

import { updateOrganisationAddress } from '../../api/API';


const Info = () => {
  const { user, fetchUser } = useAuthProvider();
  const adminNames = user?.organisationAdminNames && user.organisationAdminNames.length > 0
    ? user.organisationAdminNames.join(', ')
    : 'Nu există administratori definiți';

  // state provider
  const { setAlert } = useStateProvider();
  // active form
  const [activeForm, setActiveForm] = useState("");


  // form data
  const [formValue, setFormValue] = useState({
    headquarterAddress: ''
  });

  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };


  const handleCancel = () => {
    setActiveForm("");
    setFormValue({
      headquarterAddress: '',
    });

  };
  const clearText = () => {
    setFormValue({
      headquarterAddress: '',
    });

  };

  // isFormValid
  const isFormValid = (field) => {
    if (field === "headquarterAddress") {
      if (formValue[field].length > 9) {
        return true;
      }
    }
    return false;
  };

  // show error message
  const [showErrors, setShowErrors] = useState(false);

  // handleSubmit
  const handleSubmit = async (e, field) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFormValid(field)) {
      setShowErrors(false);
      try {
        const response = await updateOrganisationAddress(user?.idOrganisation, formValue.headquarterAddress);
        if (response.status === 200) {
          setAlert({
            type: "success",
            message: "Profile updated successfully",
          });
          fetchUser(user?.idUser)

          setActiveForm("");
        }
      } catch (error) {
        console.log(error, "error");
        setAlert({
          type: "danger",
          message: "Something went wrong on the server",
        });
      }
    } else {
      setShowErrors(true);
    }
  };
  return (
    <Container className={styles.container}>
      <Col className={styles.leftSide}>
        <div>
          <RowItem
            icon={<CiUser />}
            title="Full name"
            info={user?.firstName + ' ' + user?.lastName}
          />
          <RowItem
            icon={<MdOutlineEmail />}
            title="Email"
            info={user?.emailAdress}
          />

          <RowItem
            icon={<HiOutlineOfficeBuilding />}
            title="Organisation Name"
            info={user?.organisationName}
          />
          {user?.authorities.some(authority => authority.authority === "ORGANIZATION_ADMIN")
            ?
            <div className={styles.inputRowItem}>
              <RowItem
                active={activeForm === "headquarterAddress" ? true : false}
                onAction={() => setActiveForm("headquarterAddress")}
                onCancel={handleCancel}
                icon={<FaRegAddressCard />}
                title="Organisation Address"
                info={user?.headquarterAddress}
                action="Edit"
              />
              {activeForm === "headquarterAddress" && (
                <div className={styles.form}>
                  <Input
                    onChange={handleChange}
                    value={formValue.headquarterAddress}
                    name="headquarterAddress"
                    id="headquarterAddress"
                    type="text"
                    clearable
                    onIconClear={clearText}
                    label="Address"
                    placeholder="Change the address"
                    error={showErrors && !isFormValid("headquarterAddress")}
                    helper={
                      showErrors && !isFormValid("headquarterAddress")
                        ? "Address must be at least 10 characters"
                        : ""
                    }
                  />
                  <Button onClick={(e) => handleSubmit(e, "headquarterAddress")} label="Save" />
                </div>
              )}
            </div>
            :
            <RowItem
              icon={<HiOutlineOfficeBuilding />}
              title="Organisation Address"
              info={user?.headquarterAddress}
            />
          }
          <RowItem
            icon={<MdOutlineLocalPolice />}
            title="My roles"
            info={user?.authorities}
          />
        </div>
      </Col>

      {/* <RowItem
        icon={ <RiAdminLine />}
        title={user?.organisationName + ' administrator' + (user?.organisationAdminNames.length > 1 ? 's' : '')}
        info={adminNames}
      /> */}
      {(user?.organisationAdminNames || user?.departmentManagerName) &&
        <Col className={styles.rightSide}>
          <h1><u>{user?.organisationName}</u> {' leader' + (user?.organisationAdminNames.length > 1 ? 's' : '')}</h1>

          <div className={styles.responsiveTable}>
            <table>
              <tbody>
                {user?.organisationAdminNames &&
                  <>
                    <tr>
                      <th>Administrator</th>
                    </tr>
                    {user?.organisationAdminNames.map((name, index) => (
                      <tr key={index}>
                        <td>{name}</td>
                      </tr>
                    ))}
                  </>
                }
                {user?.departmentManagerName && (
                  <>
                    <tr>
                      <th>Department manager</th>
                    </tr>
                    <tr>
                      <td>{user?.departmentManagerName}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

        </Col>
      }
    </Container>

  )
}

export default Info