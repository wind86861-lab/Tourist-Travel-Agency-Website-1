import React, { useState, useEffect } from 'react';
import './AirplaneCursor.css';

const AirplaneCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [prevPosition, setPrevPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let idleTimer;

        const handleMouseMove = (e) => {
            setIsVisible(true);

            // Reset idle timer
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                setIsVisible(false);
            }, 1500); // Hide after 1.5s of inactivity

            const x = e.clientX;
            const y = e.clientY;

            // Calculate angle for rotation
            const angle = Math.atan2(y - prevPosition.y, x - prevPosition.x) * (180 / Math.PI);

            // Only update rotation if there is significant movement to avoid jitter
            if (Math.abs(x - prevPosition.x) > 1 || Math.abs(y - prevPosition.y) > 1) {
                setRotation(angle + 90); // Adjusting 90deg because the fa-plane icon points up
            }

            setPosition({ x, y });
            setPrevPosition({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(idleTimer);
        };
    }, [prevPosition]);

    return (
        <>
            {/* The Shadow */}
            <div
                className="airplane-shadow"
                style={{
                    left: `${position.x + 20}px`,
                    top: `${position.y + 20}px`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    opacity: isVisible ? 0.3 : 0
                }}
            >
                <i className="fa fa-plane"></i>
            </div>

            {/* The Airplane */}
            <div
                className="airplane-cursor"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    opacity: isVisible ? 1 : 0
                }}
            >
                <i className="fa fa-plane text-primary"></i>
                <div className="airplane-trail"></div>
            </div>
        </>
    );
};

export default AirplaneCursor;
