import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import useAuthProvider from '../../hooks/useAuthProvider';
import useStateProvider from '../../hooks/useStateProvider';
import styles from './EmployeesCard.module.scss';

import GetAvatar from './GetAvatar'
import { Col } from 'react-bootstrap';
import {
    StyledEngineProvider,
    Chip,
    Stack,
    Box,
    Typography,
    Tooltip,
    IconButton,
    Divider
} from '../../pages/imports/muiMaterial'
import { PersonAddAlt1Icon, PersonRemoveIcon } from '../../pages/imports/muiiconsMaterial'

import Modal from '../../components/ModalDialog/Modal';

const EmployeesCard = (props) => {
    const { user } = useAuthProvider();
    const [openPopup, setOpenPopup] = useState(false);
    const { setAlert } = useStateProvider();

    const navigate = useNavigate();
    function stopPropagation(e) {
        e.stopPropagation();
    }

    //popup
    const togglePopup = () => {
        setOpenPopup(!openPopup);
    };
    const [showAllSkills, setShowAllSkills] = useState(false);

    const handleShowAllSkills = () => {
        setShowAllSkills(true);
    };

    return (
        <Col className={styles.employeesCardContainer} >
            <Card className={styles.card} >
                {/* <div className={styles.imgContainer}> */}
                <Card.Header>
                    <GetAvatar fullName={`${props.data.firstName} ${props.data.lastName}`} />
                </Card.Header>
                <Card.Body>
                    <Card.Title className={`${styles.alignCenter} ${styles.nume}`} >{props.data.firstName + ' ' + props.data.lastName}</Card.Title>

                    <Divider />
                    <Card.Link className={`${styles.email}`} type="email" href={`mailto:${props.data.emailAdress}?subject = Team Finder`}>{props.data.emailAdress}</Card.Link>
                    {props.data?.userSkill?.length !== 0 &&
                        <>
                            <Card.Title className={`${styles.alignCenter} `} >Skills</Card.Title>
                            <Card.Body className={`${styles.displaySkills} `}>
                                {props.data?.userSkill?.length > 2 ? (
                                    <>
                                        {props.data?.userSkill?.slice(0, 2).map((skill) =>
                                            <Chip label={skill.numeSkill} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idUserSkill} />
                                        )}
                                        <Chip label={`+${props.data.userSkill.length - 2}`} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" onClick={handleShowAllSkills} />
                                    </>
                                ) : (
                                    <>
                                        {props.data?.userSkill?.map((skill) =>
                                            <Chip label={skill.numeSkill} sx={{ backgroundColor: "white" }} variant="outlined" color="primary" key={skill.idUserSkill} onClick={handleShowAllSkills} />
                                        )}
                                    </>
                                )
                                }
                            </Card.Body>

                        </>
                    }

                </Card.Body>
                <Card.Footer className={`${styles.controls}`}>
                    <div onClick={stopPropagation} className={styles.butoane}>
                        {/* <PersonAddAlt1Icon className={styles.edit} onClick={() => props.handleActionYes()} /> */}
                        {props.action === 'remove' &&
                            <>
                                {user?.idUser !== props.data?.id ?
                                    <Tooltip
                                        title='Remove user'
                                        placement='top-start'
                                        arrow
                                        onClick={() => { togglePopup() }} >
                                        <IconButton>
                                            <PersonRemoveIcon className={styles.tableButtons} />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <p style={{ fontSize: '19px' }}>You are the manager</p>
                                }
                            </>
                        }
                        {props.action === 'add' &&
                            <>
                                <Tooltip
                                    title='Add user'
                                    placement='top-start'
                                    arrow
                                    onClick={() => { togglePopup() }} >
                                    <IconButton>
                                        <PersonAddAlt1Icon className={styles.tableButtons} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        }
                    </div>
                </Card.Footer>
            </Card>
            {/* POPUP delete */}
            {
                openPopup &&
                    props.action === 'remove' ? (
                    <StyledEngineProvider injectFirst>
                        <Modal
                            open={openPopup}
                            handleClose={() => { togglePopup() }}
                            title={"Remove user from department?"}
                            content={"This action is permanent!"}
                            handleActionYes={() => { props.handleActionYes(props.data?.id); togglePopup() }}
                            textActionYes={"Remove"}
                            handleActionNo={() => { togglePopup() }}
                            textActionNo={"Cancel"}
                        />
                    </StyledEngineProvider>
                )
                    :
                    (
                        <StyledEngineProvider injectFirst>
                            <Modal
                                open={openPopup}
                                handleClose={() => { togglePopup() }}
                                title={"Add user to your department"}
                                // content={""}
                                handleActionYes={() => { props.handleActionYes(props.data?.id); togglePopup() }}
                                textActionYes={"Add"}
                                handleActionNo={() => { togglePopup() }}
                                textActionNo={"Cancel"}
                            />
                        </StyledEngineProvider>
                    )
            }
            {
                showAllSkills && (
                    <Modal
                        open={showAllSkills}
                        handleClose={() => setShowAllSkills(false)}
                        title="All Skills"
                        content={
                            <Stack direction="column" spacing={2}>
                                {props.data?.userSkill?.map((skill, index) => (
                                    <Box key={skill.idUserSkill}>
                                        <Typography variant="body1" component="div">
                                            <b>{index + 1}. {skill.numeSkill}</b>
                                        </Typography>
                                        <Typography variant="body2" component="div" sx={{ marginLeft: 1 }}>
                                            * Level: {skill.level}
                                        </Typography>
                                        <Typography variant="body2" component="div" sx={{ marginLeft: 1 }}>
                                            * Experience: {skill.experience}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        }
                        textActionNo={'Close'}
                        handleActionNo={() => setShowAllSkills(false)}
                    />
                )
            }
        </Col>
    )
}

export default EmployeesCard