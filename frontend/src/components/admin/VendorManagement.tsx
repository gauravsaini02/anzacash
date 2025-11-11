import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../shared/AdminHeader';

interface Vendor {
  id: number;
  name: string;
  businessName: string;
  avatar: string;
  applicationDate: string;
  location: string;
  category: string;
  documentsStatus: 'complete' | 'missing' | 'partial';
  documentsCount: number;
  feeStatus: 'paid' | 'pending' | 'unpaid';
  status: 'pending' | 'under_review' | 'documents_missing' | 'approved' | 'rejected' | 'suspended';
}

const VendorManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'suspended'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load Font Awesome
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
    fontAwesomeScript.crossOrigin = 'anonymous';
    fontAwesomeScript.referrerPolicy = 'no-referrer';
    document.head.appendChild(fontAwesomeScript);

    // Configure Font Awesome
    if (window.FontAwesome) {
      window.FontAwesome.config = { autoReplaceSvg: 'nest' };
    }

    loadMockData();
    setLoading(false);
  }, []);

  const loadMockData = () => {
    const mockVendors: Vendor[] = [
      {
        id: 1,
        name: 'John Mwangi',
        businessName: 'TechWorld Electronics',
        avatar: 'avatar-2',
        applicationDate: 'Dec 15, 2024',
        location: 'Dar es Salaam, Tanzania',
        category: 'Electronics & Tech',
        documentsStatus: 'complete',
        documentsCount: 5,
        feeStatus: 'paid',
        status: 'pending'
      },
      {
        id: 2,
        name: 'Sarah Kimani',
        businessName: 'Fashion Boutique',
        avatar: 'avatar-5',
        applicationDate: 'Dec 14, 2024',
        location: 'Nairobi, Kenya',
        category: 'Fashion & Clothing',
        documentsStatus: 'missing',
        documentsCount: 3,
        feeStatus: 'paid',
        status: 'documents_missing'
      },
      {
        id: 3,
        name: 'Michael Ochieng',
        businessName: 'Home & Garden Supplies',
        avatar: 'avatar-8',
        applicationDate: 'Dec 13, 2024',
        location: 'Kampala, Uganda',
        category: 'Home & Garden',
        documentsStatus: 'complete',
        documentsCount: 5,
        feeStatus: 'paid',
        status: 'under_review'
      },
      {
        id: 4,
        name: 'Grace Mutiso',
        businessName: 'Fashion Hub',
        avatar: 'avatar-4',
        applicationDate: 'Dec 10, 2024',
        location: 'Nairobi, Kenya',
        category: 'Fashion & Clothing',
        documentsStatus: 'complete',
        documentsCount: 5,
        feeStatus: 'paid',
        status: 'approved'
      },
      {
        id: 5,
        name: 'David Kamau',
        businessName: 'Sports Central',
        avatar: 'avatar-9',
        applicationDate: 'Dec 8, 2024',
        location: 'Mombasa, Kenya',
        category: 'Sports & Fitness',
        documentsStatus: 'complete',
        documentsCount: 5,
        feeStatus: 'paid',
        status: 'approved'
      },
      {
        id: 6,
        name: 'James Wanjala',
        businessName: 'Electronics Plus',
        avatar: 'avatar-3',
        applicationDate: 'Dec 5, 2024',
        location: 'Arusha, Tanzania',
        category: 'Electronics & Tech',
        documentsStatus: 'complete',
        documentsCount: 5,
        feeStatus: 'paid',
        status: 'suspended'
      }
    ];

    setVendors(mockVendors);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'documents_missing':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'under_review':
        return 'Under Review';
      case 'documents_missing':
        return 'Documents Missing';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('electronics') || category.toLowerCase().includes('tech')) {
      return 'fa-store';
    } else if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('clothing')) {
      return 'fa-tshirt';
    } else if (category.toLowerCase().includes('home') || category.toLowerCase().includes('garden')) {
      return 'fa-home';
    } else if (category.toLowerCase().includes('sports') || category.toLowerCase().includes('fitness')) {
      return 'fa-running';
    } else {
      return 'fa-store';
    }
  };

  const getCategoryColor = (category: string) => {
    if (category.toLowerCase().includes('electronics') || category.toLowerCase().includes('tech')) {
      return 'bg-blue-50';
    } else if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('clothing')) {
      return 'bg-pink-50';
    } else if (category.toLowerCase().includes('home') || category.toLowerCase().includes('garden')) {
      return 'bg-green-50';
    } else if (category.toLowerCase().includes('sports') || category.toLowerCase().includes('fitness')) {
      return 'bg-orange-50';
    } else {
      return 'bg-gray-50';
    }
  };

  const getIconColor = (category: string) => {
    if (category.toLowerCase().includes('electronics') || category.toLowerCase().includes('tech')) {
      return 'text-blue-600';
    } else if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('clothing')) {
      return 'text-pink-600';
    } else if (category.toLowerCase().includes('home') || category.toLowerCase().includes('garden')) {
      return 'text-green-600';
    } else if (category.toLowerCase().includes('sports') || category.toLowerCase().includes('fitness')) {
      return 'text-orange-600';
    } else {
      return 'text-gray-600';
    }
  };

  const getDocumentsStatusInfo = (vendor: Vendor) => {
    if (vendor.documentsStatus === 'complete') {
      return {
        bgColor: 'bg-green-50',
        icon: 'fa-check',
        iconColor: 'text-green-600',
        text: 'All Complete'
      };
    } else if (vendor.documentsStatus === 'missing') {
      return {
        bgColor: 'bg-red-50',
        icon: 'fa-exclamation-triangle',
        iconColor: 'text-red-600',
        text: `${5 - vendor.documentsCount} Missing`
      };
    } else {
      return {
        bgColor: 'bg-yellow-50',
        icon: 'fa-clock',
        iconColor: 'text-yellow-600',
        text: 'Partial'
      };
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesTab =
      (activeTab === 'pending' && (vendor.status === 'pending' || vendor.status === 'under_review' || vendor.status === 'documents_missing')) ||
      (activeTab === 'active' && vendor.status === 'approved') ||
      (activeTab === 'suspended' && vendor.status === 'suspended');

    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = vendors.filter(v => v.status === 'pending' || v.status === 'under_review' || v.status === 'documents_missing').length;
  const activeCount = vendors.filter(v => v.status === 'approved').length;
  const suspendedCount = vendors.filter(v => v.status === 'suspended').length;

  const handleApprove = (vendorId: number) => {
    console.log('Approve vendor:', vendorId);
    // In a real app, this would call an API
    setVendors(vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'approved' as const } : v
    ));
  };

  const handleReject = (vendorId: number) => {
    console.log('Reject vendor:', vendorId);
    // In a real app, this would call an API
    setVendors(vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'rejected' as const } : v
    ));
  };

  const handleSuspend = (vendorId: number) => {
    console.log('Suspend vendor:', vendorId);
    // In a real app, this would call an API
    setVendors(vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'suspended' as const } : v
    ));
  };

  const handleReinstate = (vendorId: number) => {
    console.log('Reinstate vendor:', vendorId);
    // In a real app, this would call an API
    setVendors(vendors.map(v =>
      v.id === vendorId ? { ...v, status: 'approved' as const } : v
    ));
  };

  const handleViewDetails = (vendorId: number) => {
    console.log('View vendor details:', vendorId);
    // In a real app, this would navigate to vendor details page
  };

  const handleDownloadDocuments = (vendorId: number) => {
    console.log('Download documents for vendor:', vendorId);
    // In a real app, this would trigger a download
  };

  const handleRequestDocuments = (vendorId: number) => {
    console.log('Request documents for vendor:', vendorId);
    // In a real app, this would send an email/notification
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading vendor management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader />

      <main id="vendor-management-main" className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <section id="vendor-management-header" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
              <p className="text-gray-600">Approve and manage vendor applications</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
                <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 flex items-center space-x-2">
                <i className="fa-solid fa-download"></i>
                <span>Export</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section id="vendor-tabs" className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            <div className="flex items-center space-x-2">
              <button
                id="pending-tab"
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'pending'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('pending')}
              >
                <i className="fa-solid fa-clock"></i>
                <span>Pending Approval</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                  {pendingCount}
                </span>
              </button>
              <button
                id="active-tab"
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'active'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('active')}
              >
                <i className="fa-solid fa-check-circle"></i>
                <span>Active Vendors</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                  {activeCount}
                </span>
              </button>
              <button
                id="suspended-tab"
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'suspended'
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab('suspended')}
              >
                <i className="fa-solid fa-ban"></i>
                <span>Suspended</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">
                  {suspendedCount}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Vendor List */}
        <section id="pending-vendors" className="space-y-6">
          {filteredVendors.map((vendor) => {
            const documentsInfo = getDocumentsStatusInfo(vendor);
            const canApprove = vendor.documentsStatus === 'complete' && vendor.feeStatus === 'paid';

            return (
              <div key={vendor.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={`https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/${vendor.avatar}.jpg`}
                      alt={vendor.name}
                      className="w-16 h-16 rounded-xl"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                      <p className="text-gray-600 mb-2">{vendor.businessName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <i className="fa-solid fa-calendar"></i>
                          <span>Applied: {vendor.applicationDate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="fa-solid fa-map-marker-alt"></i>
                          <span>{vendor.location}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`${getStatusBadge(vendor.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {getStatusText(vendor.status)}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fa-solid fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {/* Business Category */}
                  <div className={`${getCategoryColor(vendor.category)} rounded-xl p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center`}>
                        <i className={`fa-solid ${getCategoryIcon(vendor.category)} ${getIconColor(vendor.category)}`}></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Business Category</p>
                        <p className="font-bold text-gray-900">{vendor.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className={`${documentsInfo.bgColor} rounded-xl p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <i className={`fa-solid ${documentsInfo.icon} ${documentsInfo.iconColor}`}></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Documents</p>
                        <p className="font-bold text-gray-900">{documentsInfo.text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Registration Fee */}
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-dollar-sign text-purple-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Registration Fee</p>
                        <p className="font-bold text-gray-900 capitalize">{vendor.feeStatus.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleViewDetails(vendor.id)}
                      className="text-primary hover:text-blue-600 font-medium flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span>View Details</span>
                    </button>
                    {vendor.documentsStatus === 'complete' && (
                      <button
                        onClick={() => handleDownloadDocuments(vendor.id)}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-file-download"></i>
                        <span>Download Documents</span>
                      </button>
                    )}
                    {vendor.documentsStatus === 'missing' && (
                      <button
                        onClick={() => handleRequestDocuments(vendor.id)}
                        className="text-orange-600 hover:text-orange-800 font-medium flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-envelope"></i>
                        <span>Request Documents</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Pending/Under Review/Documents Missing Status - Show Approve/Reject */}
                    {(vendor.status === 'pending' || vendor.status === 'under_review' || vendor.status === 'documents_missing') && (
                      <>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center space-x-2"
                        >
                          <i className="fa-solid fa-times"></i>
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          disabled={!canApprove}
                          className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                            canApprove
                              ? 'bg-success text-white hover:bg-green-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>Approve</span>
                        </button>
                      </>
                    )}

                    {/* Approved Status - Show Suspend */}
                    {vendor.status === 'approved' && (
                      <button
                        onClick={() => handleSuspend(vendor.id)}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-ban"></i>
                        <span>Suspend</span>
                      </button>
                    )}

                    {/* Suspended Status - Show Reinstate */}
                    {vendor.status === 'suspended' && (
                      <button
                        onClick={() => handleReinstate(vendor.id)}
                        className="bg-success text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Reinstate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Pagination */}
        <section id="pagination" className="flex items-center justify-between mt-8">
          <div className="text-gray-600">
            Showing {filteredVendors.length} of {vendors.length} vendors
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="px-3 py-2 bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VendorManagement;