import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import './ResetPassword.css';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const checkPasswordStrength = (pwd) => {
        if (pwd.length < 8) return 'weak';

        let strength = 0;
        if (/[a-z]/.test(pwd)) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[@$!%*?&]/.test(pwd)) strength++;

        if (strength <= 2) return 'weak';
        if (strength === 3) return 'medium';
        return 'strong';
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
        setPasswordStrength(checkPasswordStrength(pwd));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (checkPasswordStrength(password) === 'weak') {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            alert('Password reset successful! You can now login with your new password.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <h1>🔒 Reset Password</h1>
                    <p>Enter your new password below</p>
                </div>

                {error && (
                    <div className="error-message">
                        <span className="error-icon">✗</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            required
                            disabled={loading}
                        />
                        {password && (
                            <div className={`password-strength ${passwordStrength}`}>
                                Password strength: <strong>{passwordStrength}</strong>
                            </div>
                        )}
                        <div className="password-requirements">
                            <small>
                                Password must be at least 8 characters and contain:
                                <ul>
                                    <li>One uppercase letter</li>
                                    <li>One lowercase letter</li>
                                    <li>One number</li>
                                    <li>One special character (@$!%*?&)</li>
                                </ul>
                            </small>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="reset-password-footer">
                    <Link to="/login" className="back-link">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
