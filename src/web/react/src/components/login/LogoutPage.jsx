import { Form, useActionData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/LoginReducer';

export default function LogoutPage(){
    const username = useSelector((state)=> state.loginState.username);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function logoutSubmit(){
        const user = username;
        const result = { success: false};
        result.error = Array();


        axios.postForm('http://localhost:5000/auth/logout', {
            user,

        }).then(data => {
            
            const response_data = data.data;
            if (response_data.success === true){
                result.success = true; 
                dispatch(logoutAction());

                //Delete CSRF token 
                delete axios.defaults.headers.common['X-CSRFToken'];
                sessionStorage.removeItem('user');
                localStorage.removeItem('user');
                alert('Logout successfully');
                navigate('/login');
            }else {
                result.success = false;
                alert('Logout failed');
                navigate('/');
            }
        }).
        catch(err => {
            result.success = false; 
            alert('Logout failed');
            navigate('/');
        });

    };

    useEffect(()=>{
        logoutSubmit();
    }, [])
    
    return (
        <>
          <div></div>
        </>
    );
}
