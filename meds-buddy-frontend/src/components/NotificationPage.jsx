import React, { useState } from 'react';
import '../style/notification.css';
import { useAuth } from '../hooks/useAuth';

const NotificationPage = () => {
    useAuth();
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const triggerNotification = () => {
        setMessage('🔔 Medication reminder sent!');
        setShow(true);

        setTimeout(() => {
            setShow(false);
        }, 4000); // auto-hide after 4 seconds
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Send Notification</h2>
            <button onClick={triggerNotification}>Send</button>

            {show && (
                <div className="popup">
                    {message}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
