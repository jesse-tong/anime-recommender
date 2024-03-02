import { Form, useActionData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import $ from 'jquery'
import { set } from 'lodash';

export default function ChangePasswordPage(props){
    const [errors, setErrors] = useState(new Array());
    const navigate = useNavigate();

    function changePassword(event){
        event.preventDefault();
        const formElement = event.target;
        console.log(event.target);
    
        const old_password = formElement.elements['old_password'].value;
        const new_password = formElement.elements['new_password'].value;
        const retype_password = formElement.elements['retype_password'].value;
        console.log(old_password, new_password, retype_password);
        const result = {};
        result.success = false;
        result.error = Array();
    
        if (typeof new_password !== 'string' || new_password.length < 6){
            result.success = false;
            result.error.push('Password must have at least 6 characters');
            setErrors(result);
        }

        if (typeof old_password !== 'string' || old_password.length < 6){
            result.success = false;
            result.error.push('Password must have at least 6 characters');
            setErrors(result);
        }

        if (new_password !== retype_password){
            result.success = false;
            result.error.push('New and retyped new password does not match');
            setErrors(result);
        }
    

        axios.postForm('http://localhost:5000/auth/change-password', {
            old_password: old_password,
            new_password: new_password
            }).then(data => {
    
            console.log('Login response: ', data)
            if (data.success === true){
                result.success = true; 
                alert('Change password successfully');
                navigate('/login');
            }else {
                result.success = false;
                result.error.push(data.error);
            }
            setErrors(result);
        }).
        catch(err => {
            result.success = false; result.error.push(err.response.data);
            setErrors(result);
        });
    }
    return (
        <>

          <Form className='form m-auto w-100 p-2 rounded-3 ' method='post' 
          id='changePasswordForm' onSubmit={(e) => changePassword(e)}>
            <div className='form-group'>
                <label htmlFor='old_password' className='form-label'>Old password (required):</label>
                <input id='old_password' name='old_password' className='form-control' type='password' required></input>
            </div>
            <div className='form-group'>
                <label htmlFor='new_password' className='form-label'>New password (required):</label>
                <input id='new_password' name='new_password' className='form-control' type='password' required></input>
            </div>
            <div className='form-group'>
                <label htmlFor='retype_password' className='form-label'>Retype new password:</label>
                <input id='retype_password' name='retype_password' className='form-control' type='password' required></input>
            </div>
            <button className='btn btn-danger mt-3' type='submit'>Change password (logout if succeed)</button>
          </Form>

        </>
    );
}

