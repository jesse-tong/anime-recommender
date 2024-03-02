import { Form,  redirect, useActionData } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage(){
    const error = useActionData();
    console.log('Register error:', error);
    const errorElement = (error !== null && error != undefined ) ? (
        <div className='bg-danger p-4 rounded text-center m-auto' style={{ maxWidth: '375px' }}>
            <span className='text-white'>{error}</span>
        </div>
        
    ): (<div ></div>);
    return (
        <>
          <div className='container-fluid mx-0 m-auto p-2'>
            {errorElement}
          <h4 className='text-center'>Register</h4>
          <Form className='form m-auto w-100 bg-light rounded border border-primary p-2' style={{ maxWidth: '375px' }}  method='post'>
          <div className='form-group'>
                <label for='name' className='form-label'>Name:</label>
                <input id='name' name='name' className='form-control' type='text'></input>
            </div>
            <div className='form-group'>
                <label for='email' className='form-label'>Email (required):</label>
                <input id='email' name='email' className='form-control' type='email' required></input>
            </div>
            <div className='form-group'>
                <label for='password' className='form-label'>Password (required):</label>
                <input id='password' name='password' className='form-control' type='password' required></input>
            </div>
            <div className='form-group'>
                <label for='user-role' className='form-label'>Role (required):</label>
                <select className='form-select form-select-sm' id='user-role' name='role'>
                    <option defaultValue={true} value='user'>User</option>
                    <option value='admin'>Admin</option>
                </select>
            </div>
            <button className='btn btn-primary mt-2' type='submit'>Register</button>
          </Form>
          </div>
        </>
    );
}

export async function register({request}){
    const formData = await request.formData();

    const username = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    const result = {};
    result.error = Array();

    if (typeof password !== 'string' || password.length < 6){
        result.success = false;
        result.error.push('Password must have at least 6 characters');
        return result.error;
    }

    try{
        var csrf_token = await axios.get('http://localhost:5000/auth/csrf_token');
        axios.defaults.headers.common['X-CSRFToken'] = csrf_token.headers['x-csrftoken'];

        var data = await axios.postForm('http://localhost:5000/auth/register', {
                name: username,
                password: password,
                email: email,
                role: role
        });

        if (data.success === true){
            result.success = true; 
            alert('Register successfully');
            redirect('/profile');
        }else {
            result.success = false;
            result.error.push(data.data.error);
        }

        
    }
    catch(err){
        result.success = false; result.error.push(err);
        result.error = err.toString();
        
    }
    if (result.success === true){
        redirect('/profile');
    }else {

        return result.error;
    }
}