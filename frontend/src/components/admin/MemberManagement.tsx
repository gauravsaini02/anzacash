import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../shared/AdminHeader';
import AdminSidebar from '../shared/AdminSidebar';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  registrationDate: string;
  location: string;
  referralCode: string;
  referredBy?: string;
  documentsStatus: 'complete' | 'missing' | 'partial';
  documentsCount: number;
  status: 'pending' | 'under_review' | 'documents_missing' | 'approved' | 'rejected' | 'suspended';
  level: number;
  commissionEarned: number;
  activeReferrals: number;
}

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
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
    const mockMembers: Member[] = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.j@email.com',
        phone: '+255 712 345 678',
        avatar: 'avatar-6',
        registrationDate: 'Dec 15, 2024',
        location: 'Dar es Salaam, Tanzania',
        referralCode: 'ALI234',
        referredBy: 'John Smith',
        documentsStatus: 'complete',
        documentsCount: 3,
        status: 'pending',
        level: 1,
        commissionEarned: 0,
        activeReferrals: 0
      },
      {
        id: 2,
        name: 'Robert Kimani',
        email: 'robert.k@email.com',
        phone: '+254 712 987 654',
        avatar: 'avatar-7',
        registrationDate: 'Dec 14, 2024',
        location: 'Nairobi, Kenya',
        referralCode: 'ROB456',
        documentsStatus: 'missing',
        documentsCount: 1,
        status: 'documents_missing',
        level: 1,
        commissionEarned: 0,
        activeReferrals: 0
      },
      {
        id: 3,
        name: 'Grace Mutiso',
        email: 'grace.m@email.com',
        phone: '+254 734 567 890',
        avatar: 'avatar-1',
        registrationDate: 'Dec 13, 2024',
        location: 'Mombasa, Kenya',
        referralCode: 'GRA789',
        referredBy: 'Sarah Davis',
        documentsStatus: 'complete',
        documentsCount: 3,
        status: 'under_review',
        level: 1,
        commissionEarned: 0,
        activeReferrals: 0
      },
      {
        id: 4,
        name: 'Michael Ochieng',
        email: 'michael.o@email.com',
        phone: '+255 756 234 567',
        avatar: 'avatar-8',
        registrationDate: 'Dec 10, 2024',
        location: 'Kampala, Uganda',
        referralCode: 'MIC123',
        referredBy: 'Alice Johnson',
        documentsStatus: 'complete',
        documentsCount: 3,
        status: 'approved',
        level: 2,
        commissionEarned: 45000,
        activeReferrals: 5
      },
      {
        id: 5,
        name: 'Sarah Kimani',
        email: 'sarah.k@email.com',
        phone: '+254 712 345 678',
        avatar: 'avatar-5',
        registrationDate: 'Dec 8, 2024',
        location: 'Nairobi, Kenya',
        referralCode: 'SAR567',
        documentsStatus: 'complete',
        documentsCount: 3,
        status: 'approved',
        level: 3,
        commissionEarned: 125000,
        activeReferrals: 12
      },
      {
        id: 6,
        name: 'James Wanjala',
        email: 'james.w@email.com',
        phone: '+254 723 456 789',
        avatar: 'avatar-3',
        registrationDate: 'Dec 5, 2024',
        location: 'Arusha, Tanzania',
        referralCode: 'JAM890',
        documentsStatus: 'complete',
        documentsCount: 3,
        status: 'suspended',
        level: 1,
        commissionEarned: 15000,
        activeReferrals: 2
      }
    ];

    setMembers(mockMembers);
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
        return 'Active Member';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-bronze-50 text-bronze-600';
      case 2:
        return 'bg-silver-50 text-silver-600';
      case 3:
        return 'bg-yellow-50 text-yellow-600';
      case 4:
        return 'bg-purple-50 text-purple-600';
      case 5:
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getDocumentsStatusInfo = (member: Member) => {
    if (member.documentsStatus === 'complete') {
      return {
        bgColor: 'bg-green-50',
        icon: 'fa-check',
        iconColor: 'text-green-600',
        text: 'All Complete'
      };
    } else if (member.documentsStatus === 'missing') {
      return {
        bgColor: 'bg-red-50',
        icon: 'fa-exclamation-triangle',
        iconColor: 'text-red-600',
        text: `${3 - member.documentsCount} Missing`
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

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('en-TZ');
  };

  const filteredMembers = members.filter(member => {
    const matchesTab =
      (activeTab === 'pending' && (member.status === 'pending' || member.status === 'under_review' || member.status === 'documents_missing')) ||
      (activeTab === 'active' && member.status === 'approved') ||
      (activeTab === 'suspended' && member.status === 'suspended');

    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.referralCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = members.filter(m => m.status === 'pending' || m.status === 'under_review' || m.status === 'documents_missing').length;
  const activeCount = members.filter(m => m.status === 'approved').length;
  const suspendedCount = members.filter(m => m.status === 'suspended').length;

  const handleApprove = (memberId: number) => {
    console.log('Approve member:', memberId);
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, status: 'approved' as const } : m
    ));
  };

  const handleReject = (memberId: number) => {
    console.log('Reject member:', memberId);
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, status: 'rejected' as const } : m
    ));
  };

  const handleSuspend = (memberId: number) => {
    console.log('Suspend member:', memberId);
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, status: 'suspended' as const } : m
    ));
  };

  const handleReinstate = (memberId: number) => {
    console.log('Reinstate member:', memberId);
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, status: 'approved' as const } : m
    ));
  };

  const handleViewDetails = (memberId: number) => {
    console.log('View member details:', memberId);
    // In a real app, this would navigate to member details page
  };

  const handleDownloadDocuments = (memberId: number) => {
    console.log('Download documents for member:', memberId);
    // In a real app, this would trigger a download
  };

  const handleRequestDocuments = (memberId: number) => {
    console.log('Request documents for member:', memberId);
    // In a real app, this would send an email/notification
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading member management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AdminHeader />

      <main id="member-management-main" className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <section id="member-management-header" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">MLM Member Management</h1>
              <p className="text-gray-600">Approve and manage MLM member applications</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
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
        <section id="member-tabs" className="mb-8">
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
                <span>Active Members</span>
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

        {/* Member List */}
        <section id="pending-members" className="space-y-6">
          {filteredMembers.map((member) => {
            const documentsInfo = getDocumentsStatusInfo(member);
            const canApprove = member.documentsStatus === 'complete';

            return (
              <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={`https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-16 h-16 rounded-xl"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <div className="flex items-center space-x-4 mb-2">
                        <p className="text-gray-600">{member.email}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-gray-600">{member.phone}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <i className="fa-solid fa-calendar"></i>
                          <span>Joined: {member.registrationDate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="fa-solid fa-map-marker-alt"></i>
                          <span>{member.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="fa-solid fa-ticket"></i>
                          <span>Code: {member.referralCode}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`${getStatusBadge(member.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {getStatusText(member.status)}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <i className="fa-solid fa-ellipsis-h"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* MLM Level */}
                  <div className={`${getLevelColor(member.level)} rounded-xl p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-layer-group text-gray-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">MLM Level</p>
                        <p className="font-bold text-gray-900">Level {member.level}</p>
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

                  {/* Commission Earned */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-coins text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Commission Earned</p>
                        <p className="font-bold text-gray-900">{formatCurrency(member.commissionEarned)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Referrals */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fa-solid fa-users text-green-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Referrals</p>
                        <p className="font-bold text-gray-900">{member.activeReferrals}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referred By */}
                {member.referredBy && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      Referred by: <span className="font-medium text-gray-900">{member.referredBy}</span>
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleViewDetails(member.id)}
                      className="text-primary hover:text-blue-600 font-medium flex items-center space-x-2"
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span>View Details</span>
                    </button>
                    {member.documentsStatus === 'complete' && (
                      <button
                        onClick={() => handleDownloadDocuments(member.id)}
                        className="text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-file-download"></i>
                        <span>Download Documents</span>
                      </button>
                    )}
                    {member.documentsStatus === 'missing' && (
                      <button
                        onClick={() => handleRequestDocuments(member.id)}
                        className="text-orange-600 hover:text-orange-800 font-medium flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-envelope"></i>
                        <span>Request Documents</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* Pending/Under Review/Documents Missing Status - Show Approve/Reject */}
                    {(member.status === 'pending' || member.status === 'under_review' || member.status === 'documents_missing') && (
                      <>
                        <button
                          onClick={() => handleReject(member.id)}
                          className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 flex items-center space-x-2"
                        >
                          <i className="fa-solid fa-times"></i>
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleApprove(member.id)}
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
                    {member.status === 'approved' && (
                      <button
                        onClick={() => handleSuspend(member.id)}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 flex items-center space-x-2"
                      >
                        <i className="fa-solid fa-ban"></i>
                        <span>Suspend</span>
                      </button>
                    )}

                    {/* Suspended Status - Show Reinstate */}
                    {member.status === 'suspended' && (
                      <button
                        onClick={() => handleReinstate(member.id)}
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
            Showing {filteredMembers.length} of {members.length} members
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

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Floating Action Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-110 flex items-center justify-center z-30"
        title="Open Task Management"
      >
        <i className="fa-solid fa-tasks text-xl"></i>
      </button>
    </div>
  );
};

export default MemberManagement;