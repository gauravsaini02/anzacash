import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  usr_uname: string;
  usr_passwd: string;
}

interface ApiResponse {
  success?: boolean;
  user?: any;
  token?: string;
  error?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('anzacash_token');
    const storedUser = localStorage.getItem('anzacash_user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // If user is already logged in, redirect to appropriate page
        if (user.usr_posio === 'admin') {
          navigate('/admin', { replace: true });
        } else if (user.usr_posio === 'vendor') {
          navigate('/dashboard', { replace: true });
        } else if (user.usr_posio === 'customer') {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('anzacash_token');
        localStorage.removeItem('anzacash_user');
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState<LoginFormData>({
    usr_uname: '',
    usr_passwd: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
    setError('');
    setSuccess('');
    setForgotMessage('');
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotEmail('');
    setForgotMessage('');
    setError('');
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      setForgotMessage('Please enter a valid email address');
      return;
    }

    setIsSendingCode(true);
    setForgotMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotEmail.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotMessage('Verification code sent to your email! You can now reset your password.');
        setTimeout(() => {
          handleCloseForgotPasswordModal();
          navigate('/reset-password');
        }, 2000);
      } else {
        setForgotMessage(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Send reset code error:', error);
      setForgotMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.usr_uname.trim() || !formData.usr_passwd.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🚀 Making login request to:', 'http://localhost:3000/api/auth/login');
      console.log('📤 Request data:', formData);

      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📥 Response status:', response.status, response.statusText);
      const data: ApiResponse = await response.json();
      console.log('📊 Response data:', data);

      if (response.ok) {
        setSuccess('Login successful! Redirecting...');

        console.log('🔑 Processing successful login');
        console.log('📋 Full response data:', data);

        // Extract user and token from the data object (backend structure: {success, data: {user, token}})
        const { user, token } = data.data || {};
        console.log('👤 Extracted user:', user);
        console.log('🎫 Extracted token:', token);

        // Store token and user data if available
        if (token && user) {
          localStorage.setItem('anzacash_token', token);
          localStorage.setItem('anzacash_user', JSON.stringify(user));
          console.log('💾 Stored token and user data in localStorage');

          // Trigger custom event to notify App component about auth change
          window.dispatchEvent(new CustomEvent('authChange', { detail: { isLoggedIn: true, user } }));
          console.log('🔄 Dispatched custom authChange event to trigger App re-check');
        } else {
          console.error('❌ Missing token or user in response');
          setError('Invalid response from server');
          return;
        }

        // Redirect to appropriate dashboard based on user role
        setTimeout(() => {
          console.log('🔄 Redirecting user based on role:', user.usr_posio);
          if (user.usr_posio === 'admin') {
            navigate('/admin', { replace: true });
          } else if (user.usr_posio === 'vendor') {
            navigate('/dashboard', { replace: true });
          } else if (user.usr_posio === 'customer') {
            navigate('/', { replace: true });
          } else {
            // For other roles, redirect to login or show appropriate page
            navigate('/login', { replace: true });
          }
        }, 1000);

      } else {
        setError(data.error || 'Login failed. Please try again.');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <div className="text-xl font-bold text-primary">ANZACASH</div>
              <nav className="hidden md:flex items-center space-x-4">
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer text-sm">Home</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer text-sm">Categories</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer text-sm">Vendors</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer text-sm">MLM Program</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer text-sm">Support</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-600 text-sm">New to ANZACASH?</span>
              <button
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline text-sm"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-4" style={{ height: 'calc(100vh - 3.5rem)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-purple-100/20"></div>
        <div className="absolute inset-0 opacity-30">
          <img
            className="w-full h-full object-cover"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png"
            alt="modern e-commerce marketplace with floating product cards, shopping icons, and digital commerce elements in soft blue and purple tones"
          />
        </div>
        <div className="absolute inset-0 bg-white/70"></div>

        {/* Login Card */}
        <section className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-primary/10 w-full max-w-md p-6 overflow-hidden" style={{ maxHeight: 'calc(100vh - 6rem)', height: 'auto' }}>
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-lock text-white text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your ANZACASH account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="usr_uname"
                  value={formData.usr_uname}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                />
                <i className="fa-solid fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="usr_passwd"
                  value={formData.usr_passwd}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                />
                <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-3 h-3 text-primary border-gray-300 rounded focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="ml-2 text-xs text-gray-600">Remember me</span>
              </label>
              <span
                onClick={handleForgotPasswordClick}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 text-xs">or</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 text-sm"
                disabled={isLoading}
              >
                <i className="fa-brands fa-google text-red-500 mr-2 text-sm"></i>
                <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 text-sm"
                disabled={isLoading}
              >
                <i className="fa-brands fa-facebook text-blue-600 mr-2 text-sm"></i>
                <span className="text-gray-700 font-medium text-sm">Continue with Facebook</span>
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              Don't have an account?
              <span
                onClick={() => navigate('/register')}
                className="text-primary font-semibold hover:underline cursor-pointer ml-1 text-sm"
              >
                Register now
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

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className="fa-solid fa-envelope text-white text-xl"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-600 text-sm">Enter your email address and we'll send you a verification code to reset your password.</p>
              </div>

              <form onSubmit={handleSendResetCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                      disabled={isSendingCode}
                    />
                    <i className="fa-solid fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForgotPasswordModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                    disabled={isSendingCode}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                    disabled={isSendingCode}
                  >
                    {isSendingCode ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Sending Code...
                      </>
                    ) : (
                      'Send Code'
                    )}
                  </button>
                </div>
              </form>

              {/* Forgot Password Message */}
              {forgotMessage && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  forgotMessage.includes('sent') || forgotMessage.includes('success')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {forgotMessage}
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

export default LoginPage;