import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../style/signup.css'

const SignupPage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('patient');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await axios.post('/signup', {
                name: fullName,
                email,
                password,
                role,
            });
            alert('Signup successful!');
            navigate(role === 'caretaker' ? '/caretaker' : '/patient');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
            <h2 >Create Account</h2>
            <form  onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                /><br />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                /><br />

                <div>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="patient"
                            checked={role === 'patient'}
                            onChange={(e) => setRole(e.target.value)}
                        /> Patient
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="caretaker"
                            checked={role === 'caretaker'}
                            onChange={(e) => setRole(e.target.value)}
                        /> Caretaker
                    </label>
                </div><br />

                <button  type="submit">Sign Up</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default SignupPage;
