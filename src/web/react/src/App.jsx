import { useEffect } from 'react'
import { Link, Outlet, Form, useLoaderData, useLocation, useSearchParams } from 'react-router-dom';
import TranslationSetting from './components/TranslationSetting';
import { useSelector, useDispatch } from "react-redux";
import { login as loginAct } from './components/store/LoginReducer';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import parse from 'style-to-object';

export async function action({request, params}){
  const {t} = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const formData = await request.formData();
  const formQueries = Object.fromEntries(formData);
}



function App() {
  const {t} = useTranslation();
  var dispatch = useDispatch();
  const location = useLocation();

  useEffect(()=>{
    axios.get('http://localhost:5000/auth/csrf_token')
    .then(res => {
      axios.defaults.headers.common['X-CSRFToken'] = res.headers['x-csrftoken'];
    })
  }, []);

  const isAuthenticated = useSelector((store) => store.loginState.authenticated);
  if(sessionStorage.getItem('user') !== null){
    dispatch(loginAct(sessionStorage.getItem('user')));
  }
  if(localStorage.getItem('user') !== null){
    dispatch(loginAct(localStorage.getItem('user')));
  }
  const username = useSelector((store)=> store.loginState.username);

  const loginAction = isAuthenticated ? (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle text-white" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Welcome, {username} !
        </a>
        <ul className="dropdown-menu" aria-labelledby="userDropdown">
            <li><Link className="dropdown-item" to={'/dashboard'}>Dashboard</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item text-danger" to={"/logout"}>{t("logout")}</Link></li> 
        </ul>
    </li>
  ) : (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle text-white" href="#" id="loginDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {t("login_or_register")}
        </a>
        <ul className="dropdown-menu" aria-labelledby="loginDropdown">
            <li><Link className="dropdown-item" to={'/login'}>{t("login")}</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to={"/register"}>{t("register")}</Link></li> 
        </ul>
    </li>
  );

  var paths = location.pathname.split('/').slice(1);
  var path = '';

  var breadCrumbElements = new Array;
  const pathFinalIndex = paths.length - 1;
  paths.forEach((value, index)=> {
    path += ('/' + value);

    breadCrumbElements.push((
      <li className={'breadcrumb-item ' + (index === pathFinalIndex ? ' active ': '')}
      aria-current={index === pathFinalIndex ? 'page' : 'false'}
       key={'breadcrumb-' + index}>
        <Link to={(index !== pathFinalIndex) ? path : '#'} 
        className={'text-decoration-none' + (index === pathFinalIndex ? ' text-black ': '')} >{value}</Link>
      </li>
    ));
  });

  const breadCrumbStyle = parse("--bs-breadcrumb-divider: '>';");

  return (
    
      <div className='container-fluid' style={{ 'padding': '0px'}}>
        <div className='navbar navbar-expand-lg navbar-dark bg-dark' >
          <Link to='/' className='navbar-brand mx-3'>
            
            <span>Anime Recommender</span>
          </Link>
          <button className='navbar-toggler' data-bs-toggle='collapse' type='button' data-bs-target='#navbarMenu'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='navbar-collapse collapse px-2' id='navbarMenu'>
            <ul className='navbar-nav ms-auto' >
              <li className='nav-item'>
                <Link to='/popular' className='nav-link'><span className='text-white'>{t("popular_anime")}</span></Link>
              </li>
              <li className='nav-item'>
                <Link to='/highest-rating' className='nav-link'><span className='text-white'>{t("highest_rating_anime")}</span></Link>
              </li>
              {loginAction}
              
              <Form className='form-inline my-sm-2 my-0' method='get' action='/search'>
                <div className='form-group d-flex flex-nowrap justify-content-center input-group w-auto'>
                  <input className='form-control' type='text' name='query' placeholder='Search anime...' />
                  <div className='input-group-append'>
                    <button className='btn btn-primary' type='submit'>{t("search")}</button>
                  </div>
                </div>
              </Form>
            </ul>
          </div>
        </div>
        <div className='container ml-2' style={breadCrumbStyle}>
          <nav aria-label='breadcrumb' style={{maxHeight: '30px'}}>
            <ol className='breadcrumb'>
              {breadCrumbElements}
            </ol>
          </nav>
        </div>
        <div className='container mt-2' style={{minHeight: '100vh'}}>
          <Outlet />
        </div>
        <footer className='bg-dark-subtle'>
          <div className='row mx-2 mx-md-3 mx-lg-4 mt-3 mt-lg-4 p-4'>
            <div className='col-12 col-lg-4 g-0 mx-3'>
              <div className='row'>
                <i></i><h3>Recommender</h3>
              </div>
              <div className='row'>
                <p>Designed and built with all the love in the world by <Link to={'/'} className='text-decoration-none'>Jesse Tong</Link> </p>
                <p>Code licensed AGPL v3.0 or any later version</p>
                <p>Currently 0.1.1</p>
                <p>I'm quite bad at frontend and UI/UX and is a newbie, pardon me</p>
              </div>
            </div>
            <div className='col-6 col-lg-2 mx-3'>
              <div className='row'><p>Languages:</p></div>
              <div className='row'>
                <TranslationSetting />
              </div>
            </div>
          </div>
          
        </footer>
      </div>
    
  )
}

export default App
