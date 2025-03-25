import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const API = process.env.REACT_APP_API_URL;

const UploadProfile = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));  // ✅ Image Preview
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized: Please login');
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.user_id;

    const formData = new FormData();
    formData.append('profile', file);

    try {
      const response = await fetch(`${API}/upload-profile/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload Response:', data);

      if (response.ok) {
        alert('✅ Profile photo uploaded successfully!');
        setPreview(`${API}${data.profile_image_url}`); // ✅ Optionally update preview to uploaded image URL
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-[#1c1b22] rounded-2xl shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Upload Profile Photo</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

      {/* ✅ Image Preview */}
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-white" />
      )}

      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
      >
        Upload Photo
      </button>
    </div>
  );
};

export default UploadProfile;