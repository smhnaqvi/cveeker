import React, { useState, useEffect } from 'react';
import { 
  authService, 
  userService, 
  resumeService, 
  type User, 
  type Resume 
} from '../lib/services';

const ApiExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example: Fetch user resumes
  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await resumeService.getResumes();
      if (response.success && response.data) {
        setResumes(response.data.data); // Note: data.data because of PaginatedResponse
      } else {
        setError(response.message || 'Failed to fetch resumes');
      }
    } catch (err) {
      setError('Failed to fetch resumes');
      console.error('Error fetching resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example: Create new resume
  const createResume = async () => {
    const newResume = {
      title: 'My New Resume',
      content: 'Resume content here...',
      template: 'modern',
    };

    try {
      const response = await resumeService.createResume(newResume);
      if (response.success && response.data) {
        console.log('Resume created:', response.data);
        // Refresh the resumes list
        fetchResumes();
      }
    } catch (err) {
      console.error('Error creating resume:', err);
    }
  };

  // Example: Login function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        // Store the token
        localStorage.setItem('access_token', response.data.token);
        console.log('Login successful:', response.data.user);
        // Fetch user profile after login
        fetchUserProfile();
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Example: Get current user from auth service
  const getCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err) {
      console.error('Error getting current user:', err);
    }
  };

  // Example: Search resumes
  const searchResumes = async (query: string) => {
    try {
      const response = await resumeService.searchResumes(query);
      if (response.success && response.data) {
        setResumes(response.data.data);
      }
    } catch (err) {
      console.error('Error searching resumes:', err);
    }
  };

  // Example: Export resume as PDF
  const exportResumePDF = async (id: number) => {
    try {
      const response = await resumeService.exportResumeAsPDF(id);
      if (response.success && response.data) {
        // Open download link
        window.open(response.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Error exporting resume:', err);
    }
  };

  useEffect(() => {
    // Check if user is logged in and fetch profile
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile();
      fetchResumes();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Services Example</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User Profile Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Profile</h2>
        {user ? (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded">
            <p>No user profile loaded</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={fetchUserProfile}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Load Profile
              </button>
              <button 
                onClick={getCurrentUser}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Get Current User
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resumes Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Resumes</h2>
        <div className="flex gap-2 mb-4">
          <button 
            onClick={fetchResumes}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Load Resumes
          </button>
          <button 
            onClick={createResume}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Create Resume
          </button>
          <button 
            onClick={() => searchResumes('modern')}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Search Modern
          </button>
        </div>
        
        {resumes.length > 0 ? (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-gray-100 p-3 rounded">
                <h3 className="font-semibold">{resume.title}</h3>
                <p className="text-sm text-gray-600">Template: {resume.template}</p>
                <p className="text-sm text-gray-600">Created: {new Date(resume.created_at).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => exportResumePDF(resume.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resumes found</p>
        )}
      </div>

      {/* Service Examples */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Service Examples</h2>
        <div className="bg-gray-100 p-4 rounded space-y-2">
          <div>
            <p className="text-sm text-gray-600 mb-1">Authentication Service:</p>
            <code className="text-xs bg-gray-200 p-2 rounded block">
              {`await authService.login({ email: 'user@example.com', password: 'password' });`}
            </code>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">User Service:</p>
            <code className="text-xs bg-gray-200 p-2 rounded block">
              {`await userService.getProfile();`}
            </code>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Resume Service:</p>
            <code className="text-xs bg-gray-200 p-2 rounded block">
              {`await resumeService.createResume({ title: 'My Resume', content: '...', template: 'modern' });`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExample; 