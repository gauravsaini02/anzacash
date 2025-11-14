import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  progress: number;
}

interface UploadedVideo {
  id: number;
  title: string;
  fileName: string;
  uploadDate: string;
  size: string;
  status: 'uploading' | 'completed' | 'failed';
  thumbnail?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'tasks' | 'videos' | 'calendar'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Upload New Training Video',
      description: 'Create and upload training video for new vendors',
      status: 'pending',
      priority: 'high',
      dueDate: 'Dec 20, 2024',
      assignedTo: 'Admin',
      progress: 0
    },
    {
      id: 2,
      title: 'Review Pending Applications',
      description: 'Review and approve vendor applications',
      status: 'in_progress',
      priority: 'medium',
      dueDate: 'Dec 18, 2024',
      assignedTo: 'Admin',
      progress: 65
    },
    {
      id: 3,
      title: 'Update Commission Structure',
      description: 'Review and update MLM commission rates',
      status: 'pending',
      priority: 'low',
      dueDate: 'Dec 25, 2024',
      assignedTo: 'Admin',
      progress: 0
    }
  ]);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([
    {
      id: 1,
      title: 'Vendor Onboarding Tutorial',
      fileName: 'vendor_onboarding.mp4',
      uploadDate: 'Dec 15, 2024',
      size: '125 MB',
      status: 'completed',
      thumbnail: 'https://via.placeholder.com/120x80/4169E1/ffffff?text=Video'
    },
    {
      id: 2,
      title: 'Product Management Guide',
      fileName: 'product_management.mp4',
      uploadDate: 'Dec 14, 2024',
      size: '89 MB',
      status: 'completed',
      thumbnail: 'https://via.placeholder.com/120x80/7C3AED/ffffff?text=Video'
    }
  ]);
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);

            // Add the uploaded video to the list
            const newVideo: UploadedVideo = {
              id: uploadedVideos.length + 1,
              title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
              fileName: file.name,
              uploadDate: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              status: 'completed',
              thumbnail: `https://via.placeholder.com/120x80/4169E1/ffffff?text=${file.name.slice(0, 4).toUpperCase()}`
            };

            setUploadedVideos([newVideo, ...uploadedVideos]);
            setVideoUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Task Management</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-times text-gray-500"></i>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'tasks'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection('tasks')}
            >
              <i className="fa-solid fa-tasks mr-2"></i>
              Tasks
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'videos'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection('videos')}
            >
              <i className="fa-solid fa-video mr-2"></i>
              Videos
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === 'calendar'
                  ? 'text-primary border-b-2 border-primary bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveSection('calendar')}
            >
              <i className="fa-solid fa-calendar mr-2"></i>
              Calendar
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Tasks Section */}
            {activeSection === 'tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Active Tasks</h3>
                  <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    <i className="fa-solid fa-plus mr-2"></i>
                    New Task
                  </button>
                </div>

                {tasks.map((task) => (
                  <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                        <div className="flex items-center space-x-3 text-xs">
                          <span className={`${getPriorityColor(task.priority)} px-2 py-1 rounded-full`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                          <span className={`${getStatusColor(task.status)} px-2 py-1 rounded-full`}>
                            {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                          <span className="text-gray-500">
                            <i className="fa-solid fa-calendar mr-1"></i>
                            {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {task.status === 'in_progress' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleTaskUpdate(task.id, { status: 'in_progress', progress: 25 })}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {task.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => handleTaskUpdate(task.id, { progress: Math.min(100, task.progress + 25) })}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Update Progress
                          </button>
                          <button
                            onClick={() => handleTaskUpdate(task.id, { status: 'completed', progress: 100 })}
                            className="px-3 py-1 bg-success text-white rounded text-xs font-medium hover:bg-green-600 transition-colors"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Videos Section */}
            {activeSection === 'videos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Video Library</h3>
                  <label className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer">
                    <i className="fa-solid fa-upload mr-2"></i>
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Progress */}
                {videoUploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading video...</span>
                      <span className="text-sm text-blue-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Video List */}
                <div className="space-y-3">
                  {uploadedVideos.map((video) => (
                    <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-16 object-cover rounded-lg"
                          />
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{video.title}</h4>
                          <p className="text-sm text-gray-500 mb-1">{video.fileName}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>
                              <i className="fa-solid fa-calendar mr-1"></i>
                              {video.uploadDate}
                            </span>
                            <span>
                              <i className="fa-solid fa-file mr-1"></i>
                              {video.size}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${
                              video.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : video.status === 'uploading'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {video.status.replace('_', ' ').charAt(0).toUpperCase() + video.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Preview"
                          >
                            <i className="fa-solid fa-play-circle"></i>
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                            title="Download"
                          >
                            <i className="fa-solid fa-download"></i>
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {uploadedVideos.length === 0 && !videoUploading && (
                  <div className="text-center py-12">
                    <i className="fa-solid fa-video text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">No videos uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Upload your first training or tutorial video</p>
                  </div>
                )}
              </div>
            )}

            {/* Calendar Section */}
            {activeSection === 'calendar' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Calendar</h3>

                  {/* Mini Calendar */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <i className="fa-solid fa-chevron-left text-gray-600"></i>
                      </button>
                      <h4 className="font-medium text-gray-900">December 2024</h4>
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <i className="fa-solid fa-chevron-right text-gray-600"></i>
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                        <div key={index} className="font-medium text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <div
                          key={day}
                          className={`py-2 rounded cursor-pointer transition-colors ${
                            day === 18 ? 'bg-primary text-white' :
                            [20, 25].includes(day) ? 'bg-blue-100 text-blue-600' :
                            'hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Deadlines */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Upcoming Deadlines</h4>
                    <div className="space-y-2">
                      {tasks
                        .filter(task => task.status !== 'completed')
                        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                        .map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                task.priority === 'high' ? 'bg-red-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                                <p className="text-xs text-gray-500">{task.dueDate}</p>
                              </div>
                            </div>
                            <span className={`${getPriorityColor(task.priority)} px-2 py-1 rounded-full text-xs`}>
                              {task.priority}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                <i className="fa-solid fa-chart-line mr-1"></i>
                {tasks.filter(t => t.status === 'completed').length} / {tasks.length} completed
              </span>
              <button
                onClick={onClose}
                className="text-primary hover:text-blue-600 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;