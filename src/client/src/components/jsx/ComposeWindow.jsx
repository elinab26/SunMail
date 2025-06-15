import React, { useState } from 'react';
import '../css/ComposeWindow.css';
import { IoClose } from "react-icons/io5";
import { AiOutlineMinus } from "react-icons/ai";
import { MdOpenInFull, MdCloseFullscreen } from "react-icons/md";

export default function ComposeWindow({ isOpen, onClose, onMinimize, isMinimized }) {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        body: ''
    });
    const [isMaximized, setIsMaximized] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (error) setError('');
    };

    const resetAndClose = () => {
        setFormData({ to: '', subject: '', body: '' });
        setIsMaximized(true);
        setError('');
        onClose();
    };

    const handleSend = async () => {
        // Basic validation
        if (!formData.to.trim()) {
            setError('Please enter a recipient');
            return;
        }
        if (!formData.subject.trim()) {
            setError('Please enter a subject');
            return;
        }
        if (!formData.body.trim()) {
            setError('Please enter a message');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/mails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies/auth
                body: JSON.stringify({
                    to: formData.to,
                    subject: formData.subject,
                    body: formData.body
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error while sending');
            }

            // Success!
            console.log('Email sent successfully');
            resetAndClose(); // Close and reset

        } catch (err) {
            console.error('Error sending email:', err);
            setError(err.message || 'Error while sending the message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMaximize = () => {
        if (isMinimized) {
            onMinimize();
            setIsMaximized(true);
        } else {
            setIsMaximized(!isMaximized);
        }
    };

    const handleMinimizeClick = () => {
        if (isMinimized) {
            onMinimize();
            setIsMaximized(false);
        } else {
            if (isMaximized) setIsMaximized(false);
            onMinimize();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`compose-window ${isMinimized ? 'minimized' : ''} ${isMaximized && !isMinimized ? 'maximized' : ''}`}>
            <div className="compose-header">
                <span className="compose-title">New message</span>
                <div className="compose-controls">
                    <button onClick={handleMinimizeClick} className="control-btn" title="Minimize">
                        <AiOutlineMinus />
                    </button>
                    <button onClick={handleMaximize} className="control-btn" title={isMaximized ? "Normal size" : "Maximize"}>
                        {isMaximized ? <MdCloseFullscreen /> : <MdOpenInFull />}
                    </button>
                    <button onClick={resetAndClose} className="control-btn" title="Close">
                        <IoClose />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <div className="compose-content">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="compose-fields">
                        {['to', 'subject'].map((field) => (
                            <div key={field} className="field-row">
                                <input
                                    type={field === 'to' ? 'email' : 'text'}
                                    name={field}
                                    placeholder={field === 'to' ? 'To' : 'Subject'}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className="compose-input"
                                    disabled={isLoading}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="compose-body">
                        <textarea
                            name="body"
                            value={formData.body}
                            onChange={handleInputChange}
                            className="compose-textarea"
                            placeholder="Write your message..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="compose-footer">
                        <button
                            onClick={handleSend}
                            className="send-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                        <div className="compose-actions">
                            {['📎', '🔗', '😊', '⋯'].map((icon, index) => (
                                <button
                                    key={index}
                                    className="action-btn"
                                    title={['Attach a file', 'Insert a link', 'Emoji', 'More options'][index]}
                                    disabled={isLoading}
                                >
                                    {icon}
                                </button>
                            ))}
                            <button onClick={resetAndClose} className="delete-btn" title="Delete" disabled={isLoading}>🗑️</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


