import React from 'react'
import axios from '../api/axiosInstance';
import '../style/navbar.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
   const onClickLogout = async () => {
  try {
    await axios.post('/logout'); 
    navigate('/', { replace: true });
  } catch (err) {
    console.error('Logout failed', err);
  }
};
    return (
        <nav className="navbar-container">
            <div className="logo-card">
                <img width="48" height="48" src="https://img.icons8.com/doodle/48/m.png" alt="m" />
                <div>
                    <h1>Meds Buddy Companion</h1>
                    <p>CareTaker View</p>
                </div>
            </div>
            <button onClick={onClickLogout} className="logout-btn" type="button">Logout</button>
        </nav>
    )
}

export default Navbar
