import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api/services';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await authService.forgotPassword(email);
            setMessage(response.message || 'Password reset instructions have been sent to your email.');
            setEmail('');
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-header">
                    <h1>🔐 Forgot Password</h1>
                    <p>Enter your email to receive password reset instructions</p>
                </div>

                {message && (
                    <div className="success-message">
                        <span className="success-icon">✓</span>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <span className="error-icon">✗</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="forgot-password-footer">
                    <Link to="/login" className="back-link">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
