import { Form, useActionData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction } from '../store/LoginReducer';
import { useTranslation } from 'react-i18next';



export default function LoginPage(){
    const {t} = useTranslation();
    const [errors, setErrors] = useState(Array());
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function loginSubmit(event){
        event.preventDefault();
        var formData = event.target;
        const email = formData.email.value;
        const password = formData.password.value;
        const remember = formData.remember.value;
        const result = { success: false};
        result.error = Array();
        

        if (typeof password !== 'string' || password.length < 6){
            result.success = false;
            errors.push('Password must have at least 6 characters');
        }
        
        //Get CSRF Token from backend first or the backend will return 400
        axios.get('http://localhost:5000/auth/csrf_token').then(res => {
            //We have to set the CSRF token in the header as Flask_wtf's CSRF protection
            //only read form data and headers, not cookies
            //Note that for some reason (maybe from Flask), the X-CSRFToken is in lowercase
            //(thus res.headers['x-csrftoken'] here)
            axios.defaults.headers.common['X-CSRFToken'] = res.headers['x-csrftoken'];

            axios.postForm('http://localhost:5000/auth/login', {
                    password: password,
                    email: email,
                    remember: remember

            }).then(data => {
                
                const response_data = data.data;
                if (response_data.success === true){
                    result.success = true; 
                    dispatch(loginAction(response_data.user));
                    if(remember == true || remember == 'true'){
                        localStorage.setItem('user', response_data.user);
                        
                    }else {
                        sessionStorage.setItem('user', response_data.user);
                    }
                    
                    navigate('/');
                }else {
                    result.success = false;
                    setErrors([response_data.error]);
                }
            }).
            catch(err => {
                result.success = false; errors.push(err.response.data);
                setErrors(errors); 
            });
        }).catch(err =>{
            errors.push(err.response.data);
            setErrors(errors);
        })

        
        if (result.success === true){
            const id = result.id;
        }
    };

    const errorElement = errors !== null ? errors.map(value => (
        <div className='bg-danger p-4 rounded text-center'>
            <span className='text-white'>{value}</span>
        </div>
    )): '';
    return (
        <>
          <div className='container-fluid mx-0 m-auto p-2'>
            {
              errorElement
            }
          <h4 className='text-center'>{t("login")}</h4>
          <Form className='form m-auto w-100 bg-light bg-outline-primary border border-primary rounded p-3' style={{ maxWidth: '375px' }} 
          method='post' onSubmit={e => loginSubmit(e)}>
            <div className='form-group'>
                <label htmlFor='email' className='form-label'>{t("email_required")}:</label>
                <input id='email' name='email' className='form-control' type='email' required></input>
            </div>
            <div className='form-group'>
                <label htmlFor='password' className='form-label'>{t("password_required")}:</label>
                <input id='password' name='password' className='form-control' type='password' required></input>
            </div>
            <div className='form-check form-switch'>
                <input id='remember' name='remember' value='true' className='form-check-input' type='checkbox'></input>
                <label className='form-check-label' htmlFor='remember' value={true} >{t('remember_login')}</label>
            </div>
            <button className='btn btn-primary mt-3' type='submit'>{t("login")}</button>
          </Form>
          </div>
        </>
    );
}

export async function login({request}){
    
}