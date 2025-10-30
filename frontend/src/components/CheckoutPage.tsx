import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('credit-card');

  const [formData, setFormData] = useState<FormData>({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+255 123 456 789',
    streetAddress: '',
    city: 'Dar es Salaam',
    region: 'Dar es Salaam',
    postalCode: '12345',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: 'Sarah Johnson',
    saveCard: false
  });

  const orderItems: OrderItem[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      quantity: 1,
      price: 129.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      quantity: 1,
      price: 199.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    },
    {
      id: '3',
      name: 'Designer Leather Handbag',
      quantity: 1,
      price: 89.99,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/83eec471e4-bf3e193df121a42fe3da.png'
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = selectedDelivery === 'standard' ? 0 : selectedDelivery === 'express' ? 12.99 : 24.99;
  const platformFee = 2.50;
  const mlmCommission = 35.50;
  const total = subtotal + shippingCost + platformFee;

  useEffect(() => {
    // Load FontAwesome and Tailwind config
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    fontAwesomeScript.onload = () => {
      if ((window as any).FontAwesome) {
        (window as any).FontAwesome.config = { autoReplaceSvg: 'nest' };
      }
    };
    document.head.appendChild(fontAwesomeScript);

    // Add Tailwind config
    if (!(window as any).tailwind) {
      const tailwindScript = document.createElement('script');
      tailwindScript.textContent = `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: '#4169E1',
                secondary: '#7C3AED',
                success: '#00C853',
                background: '#F5F5F5'
              }
            }
          }
        }
      `;
      document.head.appendChild(tailwindScript);
    }

    return () => {
      document.head.removeChild(fontAwesomeScript);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    setOrderComplete(true);
    setIsProcessing(false);

    // Redirect to confirmation page after 2 seconds
    setTimeout(() => {
      navigate('/confirmation');
    }, 2000);
  };

  const getDeliveryPrice = () => {
    switch (selectedDelivery) {
      case 'express': return 12.99;
      case 'nextday': return 24.99;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div
                className="text-2xl font-bold text-primary cursor-pointer"
                onClick={() => navigate('/')}
              >
                ANZACASH
              </div>
              <nav className="hidden md:flex items-center gap-4">
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Dashboard</span>
                <span className="text-primary font-medium cursor-pointer">Shop</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Orders</span>
                <span className="text-gray-700 hover:text-primary font-medium cursor-pointer">Rewards</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fa-solid fa-bell text-gray-600 text-xl cursor-pointer hover:text-primary"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
              <div className="relative">
                <i className="fa-solid fa-shopping-cart text-primary text-xl cursor-pointer"></i>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
              </div>
              <img
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-3 sm:px-4 py-8">
        {/* Progress Indicator */}
        <section className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Cart</span>
            </div>
            <div className="w-16 h-0.5 bg-success"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center text-white font-bold">
                <i className="fa-solid fa-check text-sm"></i>
              </div>
              <span className="ml-2 text-sm font-medium text-success">Shipping</span>
            </div>
            <div className="w-16 h-0.5 bg-primary"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
              <span className="ml-2 text-sm font-medium text-primary">Payment</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">4</div>
              <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-6">
            {/* Shipping Information */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <i className="fa-solid fa-truck text-primary text-xl"></i>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Dar es Salaam"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>Dar es Salaam</option>
                      <option>Arusha</option>
                      <option>Mwanza</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* Delivery Method */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <i className="fa-solid fa-shipping-fast text-primary text-xl"></i>
                <h2 className="text-xl font-bold text-gray-900">Delivery Method</h2>
              </div>

              <div className="space-y-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedDelivery === 'standard'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => setSelectedDelivery('standard')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery === 'standard'}
                        onChange={() => setSelectedDelivery('standard')}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Standard Delivery</h3>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-bold text-success">FREE</span>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedDelivery === 'express'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => setSelectedDelivery('express')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery === 'express'}
                        onChange={() => setSelectedDelivery('express')}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Express Delivery</h3>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">$12.99</span>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer ${
                    selectedDelivery === 'nextday'
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => setSelectedDelivery('nextday')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        checked={selectedDelivery === 'nextday'}
                        onChange={() => setSelectedDelivery('nextday')}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">Next Day Delivery</h3>
                        <p className="text-sm text-gray-600">Order before 2 PM</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">$24.99</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <i className="fa-solid fa-credit-card text-primary text-xl"></i>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    className={`border-b-2 font-semibold py-3 px-1 ${
                      selectedPayment === 'credit-card'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedPayment('credit-card')}
                  >
                    Credit Card
                  </button>
                  <button
                    className={`border-b-2 font-semibold py-3 px-1 ${
                      selectedPayment === 'mobile-money'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedPayment('mobile-money')}
                  >
                    Mobile Money
                  </button>
                  <button
                    className={`border-b-2 font-semibold py-3 px-1 ${
                      selectedPayment === 'paypal'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setSelectedPayment('paypal')}
                  >
                    PayPal
                  </button>
                </nav>
              </div>

              {selectedPayment === 'credit-card' && (
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary pr-12"
                      />
                      <div className="absolute right-3 top-3 flex space-x-1">
                        <i className="fa-brands fa-cc-visa text-blue-600 text-xl"></i>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="Sarah Johnson"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="saveCard"
                      checked={formData.saveCard}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <span className="text-sm text-gray-700">Save this card for future purchases</span>
                  </div>
                </form>
              )}

              {selectedPayment === 'mobile-money' && (
                <div className="text-center py-8">
                  <i className="fa-solid fa-mobile-alt text-6xl text-primary mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Money Payment</h3>
                  <p className="text-gray-600">Enter your mobile money number to complete payment</p>
                  <input
                    type="tel"
                    placeholder="+255 XXX XXX XXX"
                    className="w-full max-w-md mx-auto mt-4 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              )}

              {selectedPayment === 'paypal' && (
                <div className="text-center py-8">
                  <i className="fa-brands fa-paypal text-6xl text-primary mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">PayPal Payment</h3>
                  <p className="text-gray-600">You will be redirected to PayPal to complete your payment</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-success' : 'text-gray-900'}`}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Fee</span>
                    <span className="font-semibold text-gray-900">${platformFee.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">MLM Commission Earned</span>
                    <span className="font-semibold text-success">+${mlmCommission.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || orderComplete}
                  className={`w-full py-4 rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105 mb-4 ${
                    orderComplete
                      ? 'bg-success text-white'
                      : 'bg-gradient-to-r from-primary to-secondary text-white'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Processing...
                    </>
                  ) : orderComplete ? (
                    <>
                      <i className="fa-solid fa-check mr-2"></i>
                      Order Placed!
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock mr-2"></i>
                      Place Order
                    </>
                  )}
                </button>

                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <i className="fa-solid fa-shield-alt text-success"></i>
                    <span>Secure 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                    <i className="fa-brands fa-cc-visa text-xl"></i>
                    <i className="fa-brands fa-cc-mastercard text-xl"></i>
                    <i className="fa-brands fa-cc-paypal text-xl"></i>
                    <i className="fa-brands fa-apple-pay text-xl"></i>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Your payment information is secure and encrypted. We never store your card details.
                  </p>
                </div>
              </div>
            </section>

            {/* Security Badges */}
            <section className="mt-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <i className="fa-solid fa-shield-check text-success mr-2"></i>
                Security & Trust
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-lock text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">SSL secured checkout</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-user-shield text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">Data protection guaranteed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-medal text-white text-sm"></i>
                  </div>
                  <span className="text-sm text-gray-700">Trusted by 10,000+ customers</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;