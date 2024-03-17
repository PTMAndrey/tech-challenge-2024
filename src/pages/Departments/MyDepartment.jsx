import React, { useEffect, useState } from 'react'
import styles from './Departments.module.scss'
import { useNavigate, useParams } from 'react-router';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useStateProvider from '../../hooks/useStateProvider';
import useAuthProvider from '../../hooks/useAuthProvider';
import { getDepartmentByID } from '../../api/API';

const MyDepartment = () => {

    const { fetchDepartments,
        currentPageDepartments, pageSizeDepartments,
        setAlert
    } = useStateProvider();
    const { user } = useAuthProvider();
    const [department, setDepartment] = useState({});
    const navigate = useNavigate();
    const { width } = useWindowDimensions();

    // get stire from API
    useEffect(() => {
        (async () => {
            try {
                const response = await getDepartmentByID(user?.idDepartment);
                if (response?.status === 200) {
                    setDepartment(response.data);
                    console.log(response.data);
                }

            } catch (error) {
                console.log(error.message, "error");
                setAlert({
                    type: "danger",
                    message: error.message || "Something went wrong...", // Use the error message from the catch
                });
            }
        })();
    }, [user?.idDepartment]);


    return (
        <div>MyDepartment</div>
    )
}

export default MyDepartment