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

const Users = () => {
    const { setAlert } = useStateProvider();
    const { user } = useAuthProvider();
    const [singleEmail, setSingleEmail] = useState('');
    const [emailList, setEmailList] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setSingleEmail(e.target.value);
        // Reset emailList and uploadedFile if user starts typing a single email
        if (e.target.value) {
            setEmailList([]);
            setUploadedFile(null);
        }
    };

    // const handleFileUpload = useCallback((files) => {
    //     const file = files[0];
    //     setUploadedFile(file);
    //     setSingleEmail(''); // Clear single email input when file is uploaded

    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const data = new Uint8Array(e.target.result);
    //         const workbook = XLSX.read(data, { type: 'array' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         const json = XLSX.utils.sheet_to_json(worksheet);
    //         const emails = json.map(row => row.email || row.Email || row.EMAIL).filter(email => email);
    //         setEmailList(emails);
    //     };
    //     reader.readAsArrayBuffer(file);
    // }, []);
    const handleFileUpload = useCallback((files) => {
        const file = files[0];
        setUploadedFile(file);
        setSingleEmail(''); // Clear single email input when file is uploaded

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
            console.log(emails);
        };
        reader.readAsArrayBuffer(file);
    }, []);


    const handleCancelFile = () => {
        setUploadedFile(null);
        setEmailList([]);
    };

    const sendInvitations = async () => {
        const emailsToSend = singleEmail ? [singleEmail] : emailList;

        if (emailsToSend.length === 0) {
            setAlert({ type: "danger", message: "Please provide an email or upload a file." });
            return;
        }
        setIsLoading(true);
        try {
            await sendEmailInvitations({
                idOrganisationAdmin: user?.idUser || "",
                emailList: emailsToSend,
            });
            setAlert({ type: "success", message: "Invitations sent successfully." });
            setUploadedFile(null);
            setSingleEmail('');
            setEmailList([]);
        } catch (error) {
            setAlert({ type: "danger", message: error.message || "Something went wrong." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid>
            <Input
                type="email"
                placeholder="Email"
                label="Email"
                id="singleEmail"
                name="singleEmail"
                value={singleEmail}
                onChange={handleInputChange}
                disabled={!!uploadedFile}
            />
            <h2>OR</h2>
            <Dropzone onDrop={handleFileUpload} />
            {uploadedFile && (
                <div className={styles.uploadedFileInfo}>
                    <p>Uploaded file: {uploadedFile.name}</p>
                    {!isLoading && <Button variant="destructive" label="Cancel file" onClick={handleCancelFile} />}
                </div>
            )}
            {isLoading ? (
                <div className={styles.spinner}></div>
            ) : (
                <Button variant="primary" label="Send Invitations" onClick={sendInvitations} disabled={!singleEmail && emailList.length === 0 || isLoading} />
            )}
        </Container>
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

export default Users;