import React, {useState} from 'react';
// import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {apiCall} from '../services/api';
// import {setAuthUser} from '../store/actions/auth';

function AuthForm(props) {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassowrd] = useState('');
  const [error, setError] = useState({});
  //   const dispatch = useDispatch();
  //   const error = useSelector((state) => state.error);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === 'username') setUsername(e.target.value);
    else setPassowrd(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    apiCall('post', '/auth/signin', {username, password}).then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        props.setUser({res});
        setError({});
        history.push('/');
      }
      if (res.error) {
        setError(res.error);
      }
    });
    // dispatch(setAuthUser('signin', {email, password})).then(() => history.push('/'));
  };
  if (props.user.isAuthenticated) history.push('/');
  return (
    <div className='container pt-4 '>
      <div className='row justify-content-md-center '>
        <div className='col-9  col-md-10 col-lg-7 col-xl-6'>
          <h2>Login</h2>
          {error.message && <div className='alert alert-danger'>{error.message}</div>}
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='username'>Username</label>
              <input
                className='form-control'
                type='text'
                value={username}
                name='username'
                onChange={handleChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                className='form-control'
                type='password'
                value={password}
                name='password'
                onChange={handleChange}
              />
            </div>
            {/* {signup && (
              <>
                <div className='form-group'>
                  <label htmlFor='username'>Username</label>
                  <input
                    className='form-control'
                    type='text'
                    value={username}
                    name='username'
                    onChange={handleChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='profileImageUrl'>Profile Image Url</label>
                  <input
                    className='form-control'
                    type='text'
                    value={profileImageUrl}
                    name='profileImageUrl'
                    onChange={handleChange}
                  />
                </div>
              </>
            )} */}
            <button type='submit' className='btn btn-primary'>
              {/* {buttonText} */}
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
