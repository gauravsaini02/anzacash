import React, { useState, useRef } from 'react';
import vendorService from '../../services/vendorService';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorData: any;
  onUpdate: (updatedData: any) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  vendorData,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    fullName: vendorData?.user?.fullName || '',
    email: vendorData?.user?.email || '',
    phone: vendorData?.user?.phone || '',
    country: vendorData?.user?.country || ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Maximum size is 5MB.');
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    console.log('🚀 Starting profile update...');
    console.log('📋 Form data:', formData);
    console.log('🖼️ Profile image selected:', !!profileImage);

    try {
      // Update profile information first
      console.log('📝 Updating profile information...');
      const updatedData = await vendorService.updateVendorProfile(formData);
      console.log('✅ Profile information updated:', updatedData);

      // Upload profile picture if selected
      if (profileImage) {
        console.log('📤 Uploading profile picture...');
        const uploadResult = await vendorService.uploadProfilePicture(profileImage);
        console.log('✅ Profile picture uploaded:', uploadResult);

        // Merge the new photo URL with updated data
        updatedData.photo = uploadResult.photoUrl;
      }

      console.log('🎉 Final updated data:', updatedData);
      onUpdate(updatedData);
      setSuccess('Profile updated successfully!');

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('❌ Profile update error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      console.error('❌ Error details:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getProfileImageUrl = () => {
    if (previewImage) return previewImage;
    if (vendorData?.user?.photo && vendorData.user.photo !== 'N/A') {
      return `http://localhost:3000${vendorData.user.photo}`;
    }
    return "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            <img
              src={getProfileImageUrl()}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="profile-picture"
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition"
            >
              <i className="fa-solid fa-camera text-sm"></i>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="profile-picture"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {previewImage && (
            <button
              onClick={handleRemoveImage}
              className="mt-2 text-sm text-red-600 hover:text-red-700 transition"
            >
              Remove Image
            </button>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Click camera icon to change profile picture
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              placeholder="Enter your country"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;