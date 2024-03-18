import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { RiEdit2Fill } from 'react-icons/ri';
import { RiDeleteBinFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import useAuthProvider from '../../hooks/useAuthProvider';
import useStateProvider from '../../hooks/useStateProvider';
import styles from './EmployeesCard.module.scss';

import GetAvatar from './GetAvatar'
import { Col } from 'react-bootstrap';
import {
    StyledEngineProvider,
    Chip,
    Stack
} from '../../pages/imports/muiMaterial'

import Modal from '../../components/ModalDialog/Modal';
import { Divider } from '@mui/material';

const EmployeesCard = (props) => {
    const { user } = useAuthProvider();
    const [openPopup, setOpenPopup] = useState(false);
    const { setAlert } = useStateProvider();

    const navigate = useNavigate();
    function stopPropagation(e) {
        e.stopPropagation();
    }

    //popup
    const togglePopup = (props) => {
        setOpenPopup(!openPopup);
    };
    return (
        <Col className={styles.employeesCardContainer} >
            <Card className={styles.card} >
                {/* <div className={styles.imgContainer}> */}
                <Card.Header>
                    <GetAvatar fullName={`${props.data.firstName} ${props.data.lastName}`} />
                </Card.Header>
                <Card.Body>
                    <Card.Link type="email">{props.data.emailAdress}</Card.Link>
                    <Divider />
                    <Card.Title className={`${styles.alignCenter} ${styles.nume}`} >{props.data.firstName + ' ' + props.data.lastName}</Card.Title>
                    {props.data.userSkill.length !== 0 && <>
                        <Card.Title className={`${styles.alignCenter} `} >Skills</Card.Title>

                        <Card.Title>
                            <Stack direction="row" spacing={2}>
                                {props.data.userSkill.map(skill =>
                                    <Chip label={skill.numeSkill} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idUserSkill} />
                                )}
                            </Stack>
                        </Card.Title>
                    </>
                    }

                </Card.Body>
                <Card.Footer className={`${styles.controls}`}>
                    <div onClick={stopPropagation} className={styles.butoane}>
                        <RiEdit2Fill className={styles.edit} onClick={() => props.handleActionYes()} />

                        <RiDeleteBinFill className={styles.delete} onClick={() => { togglePopup(); }} />
                    </div>
                </Card.Footer>
            </Card>
            {/* POPUP delete */}
            {
                openPopup && (
                    <StyledEngineProvider injectFirst>
                        <Modal
                            open={openPopup}
                            handleClose={togglePopup}
                            title={"Are you sure?"}
                            content={"This action is permanent!"}
                            // handleActionYes={() => handleDeleteDepartment()}
                            textActionYes={"Delete"}
                            // handleActionNo={handleCloseDelete}
                            textActionNo={"Cancel"}
                        />
                    </StyledEngineProvider>
                )
            }
        </Col>
    )
}

export default EmployeesCard