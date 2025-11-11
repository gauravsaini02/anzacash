import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [showResendModal, setShowResendModal] = useState(false);

  // Password strength calculation
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength++;
    if (/\d/.test(newPassword)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength++;

    setPasswordStrength(strength);
  }, [newPassword]);

  // Password match check
  useEffect(() => {
    if (confirmPassword.length === 0) {
      setPasswordMatch(null);
      return;
    }

    setPasswordMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 6);
    setVerificationCode(value);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleResendCode = () => {
    setShowResendModal(true);
    setError('');
    setSuccess('');
    setResendMessage('');
  };

  const handleCloseResendModal = () => {
    setShowResendModal(false);
    setResendEmail('');
    setResendMessage('');
  };

  const handleSendNewCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resendEmail.trim()) {
      setResendMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resendEmail.trim())) {
      setResendMessage('Please enter a valid email address');
      return;
    }

    setResendLoading(true);
    setResendMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resendEmail.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResendMessage('New verification code sent to your email!');
        setTimeout(() => {
          handleCloseResendModal();
          setResendMessage('Code sent! Check your email.');
          setTimeout(() => setResendMessage(''), 5000);
        }, 2000);
      } else {
        setResendMessage(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Send reset code error:', error);
      setResendMessage('Network error. Please check your connection and try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Add actual API call later
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationCode,
          newPassword
        })
      });

      if (response.ok) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength - 1] || 'Weak';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-primary">ANZACASH</div>
              <nav className="hidden md:flex items-center space-x-6">
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Home</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Categories</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Vendors</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">MLM Program</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Support</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Remember your password?</span>
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-medium hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center h-screen" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-purple-100/20"></div>
        <div className="absolute inset-0 opacity-30">
          <img
            className="w-full h-full object-cover"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-94f38eb12702769671c4.png"
            alt="modern e-commerce marketplace with floating product cards, shopping icons, and digital commerce elements in soft blue and purple tones"
          />
        </div>
        <div className="absolute inset-0 bg-white/70"></div>

        {/* Reset Password Card */}
        <section className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-primary/10 w-full max-w-md p-5 overflow-hidden" style={{ maxHeight: 'calc(100vh - 6rem)', height: 'auto' }}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-key text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter the code sent to your email and create a new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Verification Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-center text-base font-semibold tracking-widest"
                  disabled={isLoading}
                />
                <i className="fa-solid fa-shield-check absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Code expires in 10 minutes</span>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-xs text-primary hover:underline font-medium"
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <i className="fa-solid fa-spinner fa-spin mr-1"></i>
                  ) : (
                    ''
                  )}
                  {resendMessage || 'Resend Code'}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <i className={`fa-solid ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded flex-1 ${
                          index < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span
                    className={`text-xs ${
                      passwordStrength <= 1 ? 'text-red-500' :
                      passwordStrength <= 2 ? 'text-yellow-500' :
                      passwordStrength <= 3 ? 'text-blue-500' : 'text-success'
                    }`}
                  >
                    Password strength: {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && passwordMatch !== null && (
                <div className="mt-2 text-xs">
                  {passwordMatch ? (
                    <span className="text-success">
                      <i className="fa-solid fa-check mr-1"></i>
                      Passwords match
                    </span>
                  ) : (
                    <span className="text-red-500">
                      <i className="fa-solid fa-times mr-1"></i>
                      Passwords do not match
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <i className={`fa-solid fa-check text-xs ${
                  newPassword.length >= 8 ? 'text-success' : 'text-gray-400'
                }`}></i>
                <span className={`text-xs ${
                  newPassword.length >= 8 ? 'text-gray-600' : 'text-gray-400'
                }`}>At least 8 characters</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className={`fa-solid fa-check text-xs ${
                  /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-success' : 'text-gray-400'
                }`}></i>
                <span className={`text-xs ${
                  /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-gray-600' : 'text-gray-400'
                }`}>Upper & lowercase letters</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className={`fa-solid fa-check text-xs ${
                  /\d/.test(newPassword) ? 'text-success' : 'text-gray-400'
                }`}></i>
                <span className={`text-xs ${
                  /\d/.test(newPassword) ? 'text-gray-600' : 'text-gray-400'
                }`}>At least one number</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <span
                onClick={() => navigate('/login')}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}
        </section>

        {/* Resend Code Modal */}
        {showResendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-envelope text-white text-xl"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Resend Verification Code</h2>
                <p className="text-gray-600 text-sm">Enter your email address and we'll send you a new verification code.</p>
              </div>

              <form onSubmit={handleSendNewCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                      disabled={resendLoading}
                    />
                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseResendModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                    disabled={resendLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    disabled={resendLoading}
                  >
                    {resendLoading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Sending Code...
                      </>
                    ) : (
                      'Send New Code'
                    )}
                  </button>
                </div>
              </form>

              {/* Resend Message */}
              {resendMessage && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  resendMessage.includes('sent') || resendMessage.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {resendMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-success/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-primary/10 rounded-full animate-pulse delay-700"></div>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordPage;