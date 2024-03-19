import React, { useCallback, useState } from 'react';
import styles from './Users.module.scss'
import { Container } from 'react-bootstrap';
import Input from '../../components/input/Input';
import Button from '../../components/Button/Button';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import useStateProvider from '../../hooks/useStateProvider';
import useAuthProvider from '../../hooks/useAuthProvider';
import { sendEmailInvitations } from '../../api/API';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ContentCopyIcon } from '../imports/muiiconsMaterial';

const Invitations = () => {
    const { setAlert } = useStateProvider();
    const { user } = useAuthProvider();
    const [singleEmail, setSingleEmail] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const [value, setValue] = useState(user?.registrationUrl);
    const [copied, setCopied] = useState(false);
    const otherCopy = () => setCopied(true);
    const onClick = ({ target: { innerHTML } }) => {
        setAlert({ type: "success", message: "You can now use invitation link" });
    };


    const handleInputChange = (e) => {
        setSingleEmail(e.target.value);
        // Reset emailList and uploadedFile if user starts typing a single email
        if (e.target.value) {
            setEmailList([]);
            setUploadedFile(null);
        }
    };

    const handleFileUpload = useCallback((files) => {
        const file = files[0];
        setUploadedFile(file);
        setSingleEmail({ singleEmail: '' }); // Clear single email input when file is uploaded

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const emails = json.map(row => {
                let email = null;
                Object.keys(row).forEach(key => {
                    if (key.toLowerCase().includes('email')) {
                        email = row[key] ? row[key].trim() : null;
                    }
                });
                return email;
            })
                .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
            setEmailList(emails);
            setShowErrors(false);
        };
        reader.readAsArrayBuffer(file);
    }, []);


    const handleCancelFile = () => {
        setUploadedFile(null);
        setEmailList([]);
    };

    const sendInvitations = async () => {
        const emailsToSend = singleEmail ? [singleEmail.singleEmail] : emailList;

        if (emailsToSend.length === 0) {
            setAlert({ type: "danger", message: "Please provide an email or upload a file." });
            return;
        }
        if (!isFormValid()) {
            setShowErrors(true);
            setAlert({
                type: "danger",
                message: "Fill all the required fields correctly.",
            });
        }
        if (isFormValid()) {
            setIsLoading(true);
            setShowErrors(false);
            try {
                await sendEmailInvitations({
                    idOrganisationAdmin: user?.idUser || "",
                    emailList: emailsToSend,
                });
                setAlert({ type: "success", message: "Invitations sent successfully." });
                setUploadedFile(null);
                setSingleEmail({singleEmail:''});
                setEmailList([]);
            } catch (error) {
                setAlert({ type: "danger", message: error.message || "Something went wrong." });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const [showErrors, setShowErrors] = useState(false);
    const handleChange = (e) => {
        setShowErrors(false)
        const { name, value } = e.target;
        setSingleEmail((prev) => {
            return { ...prev, [name]: value };
        });

        setUploadedFile(null);
    };
    const checkErrors = (field) => {
        // email
        if (field === "singleEmail") {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(singleEmail.singleEmail) === false)
                return "Email address is invalid!";
        }
        return "";
    };
    const isFormValid = () => {
        let isValid = true;
        Object.keys(singleEmail).forEach((field) => {
            if (checkErrors(field)) {
                isValid = false;
            }
        });
        return isValid;
    };

    return (
        <Container fluid className={styles.pageInvitations}>
            <div className={styles.containerInvitiations}>
                <Input
                    disabled
                    type="text"
                    id="registerURL"
                    name="registerURL"
                    value={user?.registrationUrl}
                />
                <CopyToClipboard
                    onCopy={otherCopy}
                    options={{ message: "Whoa!" }}
                    text={value}
                >
                    <Button
                        label="Copy to clipboard"
                        icon={<ContentCopyIcon />}
                        position="left"
                        variant="transparent"
                        border={false}
                        onClick={onClick}
                    />

                </CopyToClipboard>
            </div>
            <hr />

            <div className={styles.containerInvitiations}>
                <Input
                    type="email"
                    placeholder="Email"
                    label="Email"
                    id="singleEmail"
                    name="singleEmail"
                    value={singleEmail?.singleEmail}
                    onChange={(e)=> handleChange(e)}
                    disabled={!!uploadedFile}
                    error={showErrors && checkErrors("singleEmail") ? true : false}
                    helper={showErrors ? checkErrors("singleEmail") : ""}
                />
            </div>
            <h2>OR</h2>

            <div className={styles.containerInvitiations}>
                <p>Only excel ( *.xlsx ) file accepted</p>
                <Dropzone onDrop={handleFileUpload} />
                {
                    uploadedFile && (
                        <div className={styles.uploadedFileInfo}>
                            <p>Uploaded file: {uploadedFile.name}</p>
                            {!isLoading && <Button variant="destructive" label="Cancel file" onClick={handleCancelFile} />}
                        </div>
                    )
                }
                {
                    isLoading ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        <Button variant="primary" label="Send Invitations" onClick={sendInvitations} disabled={!singleEmail && emailList.length === 0 || isLoading} />
                    )
                }
            </div>
        </Container >
    );
};


function Dropzone({ onDrop, accept, open }) {
    const {
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
        isDragActive,
    } = useDropzone({
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
        },
        maxFiles: 1,
        onDrop,
    });

    const [isHovered, setHovered] = useState(false);
    return (
        <div
            onMouseLeave={() => setHovered(false)}
            onMouseOver={() => setHovered(true)}
        >
            <div
                {...getRootProps({
                    className: `${styles.dropzone} ${isDragAccept && styles.accept} ${isDragReject && styles.reject}`,
                })}
            >
                <input {...getInputProps()} />
                <div>
                    {isDragActive ? (
                        isDragReject ? (
                            <p>File not supported</p>
                        ) : (
                            <p>Release here</p>
                        )
                    ) : isHovered ? (
                        <p>Drag and drop or click</p>
                    ) : (
                        <p>Add excel file to upload</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invitations;