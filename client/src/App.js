import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import Main from './components/Main';
import {useState} from 'react';
import {setTokenHeader} from './services/api';
import jwtDecode from 'jwt-decode';

function App() {
  const [user, setUser] = useState({isAuthenticated: false});

  if (localStorage.token && !user.isAuthenticated) {
    var token = localStorage.token;
    var tokenDecoded = jwtDecode(token);
    console.log('auth token is ', tokenDecoded);
    if (tokenDecoded.exp > Math.floor(new Date() / 1000)) {
      setTokenHeader(token);
      setUser({...tokenDecoded, isAuthenticated: true});
      console.log('decoded token', jwtDecode(token));
    } else localStorage.removeItem('token');
  }
  // var token = localStorage.getItem('token');
  // if (token) {
  //   setUser;
  // }

  return (
    <div className='container'>
      <Router>
        <Main user={user} setUser={setUser} />
      </Router>
    </div>
  );
}

export default App;
