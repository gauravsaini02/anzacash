import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface RegisterFormData {
  usr_uname: string;
  usr_passwd: string;
  usr_email: string;
  usr_phone: string;
  full_name: string;
  usr_county: string;
  usr_posio: string;
  referralCode: string;
  termsAccepted: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [sponsor, setSponsor] = useState<string>('');

  const [formData, setFormData] = useState<RegisterFormData>({
    usr_uname: '',
    usr_passwd: '',
    usr_email: '',
    usr_phone: '',
    full_name: '',
    usr_county: 'Tanzania',
    usr_posio: 'customer',
    referralCode: '',
    termsAccepted: false
  });

  const [userType, setUserType] = useState<'customer' | 'vendor' | 'mlm'>('customer');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auto-fill sponsor from URL parameters
  useEffect(() => {
    const sponsorParam = searchParams.get('sponsor') || searchParams.get('ref') || searchParams.get('affiliate');
    if (sponsorParam) {
      setSponsor(sponsorParam);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleUserTypeChange = (newUserType: 'customer' | 'vendor' | 'mlm') => {
    setUserType(newUserType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.usr_uname.trim() || !formData.full_name.trim() || !formData.usr_email.trim() || !formData.usr_phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.usr_passwd.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.usr_passwd !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const registrationData = {
        ...formData,
        usr_posio: userType,
        sponsor: sponsor || undefined
      };

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');

        // Show success message and redirect
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
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
              <span className="text-gray-600">Already have an account?</span>
              <button
                onClick={() => navigate('/login')}
                className="text-primary font-medium hover:underline"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex h-screen" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Left Panel */}
        <section className="w-2/5 bg-gradient-to-br from-primary to-secondary p-12 flex flex-col justify-center text-white">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-6">Join ANZACASH</h1>
              <p className="text-xl opacity-90 mb-8">Connect with thousands of trusted vendors and discover amazing opportunities</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-store text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Multi-Vendor Marketplace</h3>
                  <p className="opacity-80">Access thousands of products from verified vendors</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-coins text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold">MLM Commission System</h3>
                  <p className="opacity-80">Earn commissions by referring products and vendors</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-shield-alt text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold">Secure & Trusted</h3>
                  <p className="opacity-80">Safe transactions with buyer protection</p>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg" alt="testimonial" className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <div className="flex text-yellow-300">
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                    <i className="fa-solid fa-star text-sm"></i>
                  </div>
                </div>
              </div>
              <p className="opacity-90">"Amazing platform! I've earned over $2,500 in MLM commissions in just 3 months. The vendor quality is exceptional."</p>
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="w-3/5 bg-white p-12 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-lg p-6" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Join thousands of successful members today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username and Full Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="usr_uname"
                    value={formData.usr_uname}
                    onChange={handleInputChange}
                    placeholder="Choose a username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="usr_email"
                  value={formData.usr_email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="usr_phone"
                  value={formData.usr_phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="usr_passwd"
                      value={formData.usr_passwd}
                      onChange={handleInputChange}
                      placeholder="Create password"
                      className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                      disabled={isLoading}
                      required
                    />
                    <i className="fa-solid fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition text-base"
                      disabled={isLoading}
                      required
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
                </div>
              </div>

              {/* Sponsor Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor
                  <i
                    className="fa-solid fa-info-circle text-primary ml-1 cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  ></i>
                </label>
                <input
                  type="text"
                  value={sponsor}
                  placeholder="Sponsor username (auto-filled)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  readOnly
                />

                {/* Tooltip */}
                {showTooltip && (
                  <div
                    className="absolute z-50 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 max-w-xs"
                    style={{ top: '-40px', left: '60px' }}
                  >
                    This field is automatically filled when you join through a sponsor's affiliate link
                    <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -bottom-1 left-4"></div>
                  </div>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
                <select
                  name="usr_county"
                  value={formData.usr_county}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  disabled={isLoading}
                >
                  <option value="Tanzania">Tanzania (Auto-detected)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">User Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['customer', 'vendor', 'mlm'] as const).map((type) => (
                    <label key={type} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value={type}
                        checked={userType === type}
                        onChange={() => handleUserTypeChange(type)}
                        className="sr-only"
                      />
                      <div className={`border-2 p-3 rounded-lg text-center transition ${
                        userType === type
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
                      }`}>
                        <i className={`fa-solid mb-2 block ${
                          type === 'customer' ? 'fa-user' :
                          type === 'vendor' ? 'fa-store' : 'fa-users'
                        }`}></i>
                        <span className="text-sm font-medium capitalize">{type} {type === 'mlm' ? 'Member' : ''}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Referral Code (conditional) */}
              {(userType === 'vendor' || userType === 'mlm') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code (Optional)
                    <i className="fa-solid fa-info-circle text-primary ml-1 cursor-help" title="Enter a referral code to get special benefits and help your referrer earn commissions"></i>
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleInputChange}
                    placeholder="Enter referral code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Registration Fee (conditional) */}
              {(userType === 'vendor' || userType === 'mlm') && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">Annual Registration Fee</h4>
                      <p className="text-sm text-gray-600">Required for Vendor and MLM Member accounts</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">13,000 TZS</p>
                      <p className="text-sm text-gray-500">or $7 USD</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <span className="text-primary hover:underline cursor-pointer">Terms & Conditions</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By creating an account, you agree to our terms and confirm you're 18+ years old
                </p>
              </div>
            </form>

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
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;