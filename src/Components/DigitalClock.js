import React, { useState, useEffect } from 'react';
import '../Components/DigitalClock.css';

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const formattedTime = time.toLocaleTimeString();
    const formattedDate = time.toLocaleDateString();

    return (
        <div className="clock-container">
            <div className="clock-time">{formattedTime}</div>
            <div className="clock-date">{formattedDate}</div>
        </div>
    );
};

export default DigitalClock;
