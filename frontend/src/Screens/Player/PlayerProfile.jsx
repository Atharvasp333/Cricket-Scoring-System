import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import { Components, Icons } from '../../exports';

const { 
  Card, 
  Input, 
  Select, 
  Button, 
  TextArea,
  Modal
} = Components;

const { 
  FiEdit2, 
  FiSave, 
  FiCalendar, 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiActivity, 
  FiTarget, 
  FiAward, 
  FiX,
  FiPlus,
  FiTrash2
} = Icons;

const PlayerProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [playerData, setPlayerData] = useState({
    fullName: '',
    dateOfBirth: '',
    battingStyle: '', // Empty string instead of default value
    bowlingStyle: '', // Empty string instead of default value
    bowlerType: '', // Empty string instead of default value
    height: '',
    weight: '',
    teams: [],
    bio: '',
    phoneNumber: '',
    address: ''
  });
  const [age, setAge] = useState(0);

  const battingStyles = ['Right-handed', 'Left-handed'];
  const bowlingStyles = ['Right-arm', 'Left-arm'];
  const bowlerTypes = ['Fast', 'Medium', 'Spin', 'Pace', 'Leg-spin', 'Off-spin'];

  // Check for dark mode preference on component mount
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (currentUser) {
        try {
          const response = await api.get(`/api/users/${currentUser.uid}`);
          const userData = response.data;
          
          setPlayerData({
            fullName: userData.displayName || '',
            dateOfBirth: userData.dateOfBirth || '',
            battingStyle: userData.battingStyle || '', // No default value
            bowlingStyle: userData.bowlingStyle || '', // No default value
            bowlerType: userData.bowlerType || '', // No default value
            height: userData.height || '',
            weight: userData.weight || '',
            teams: userData.teams || [],
            bio: userData.bio || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || ''
          });
          
          if (userData.dateOfBirth) {
            calculateAge(userData.dateOfBirth);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log('User not found in database, using default values');
            const defaultData = {
              fullName: currentUser.displayName || '',
              dateOfBirth: '',
              battingStyle: '', // No default value
              bowlingStyle: '', // No default value
              bowlerType: '', // No default value
              height: '',
              weight: '',
              teams: [],
              bio: '',
              phoneNumber: '',
              address: ''
            };
            setPlayerData(defaultData);
          } else {
            console.error('Error fetching player data:', error);
          }
        }
      }
    };
    
    fetchPlayerData();
  }, [currentUser]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let calculatedAge = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      calculatedAge--;
    }
    
    setAge(calculatedAge);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'dateOfBirth') {
      calculateAge(value);
    }
  };

  const handleSave = async () => {
    try {
      if (currentUser) {
        const userData = {
          email: currentUser.email,
          displayName: playerData.fullName,
          role: 'player',
          firebaseUID: currentUser.uid,
          photoURL: currentUser.photoURL || '',
          battingStyle: playerData.battingStyle,
          bowlingStyle: playerData.bowlingStyle,
          bowlerType: playerData.bowlerType,
          phoneNumber: playerData.phoneNumber,
          dateOfBirth: playerData.dateOfBirth,
          height: playerData.height,
          weight: playerData.weight,
          bio: playerData.bio,
          address: playerData.address
        };
        
        await api.post('/api/users', userData);
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating player data:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with dark mode toggle */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Player Profile
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage your cricket profile and statistics
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 shadow-lg' 
                  : 'bg-white text-gray-800 hover:bg-gray-50 shadow-md'
              }`}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Main Profile Card */}
          <div className={`rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm ${
            darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-white/20'
          }`}>
            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
              <div className="relative group">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Player" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl transition-transform duration-300 group-hover:scale-105 ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
                  }`}>
                    <FiUser />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={playerData.fullName}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <h2 className={`text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                    {playerData.fullName || 'Player Name'}
                  </h2>
                )}
                
                <div className="flex flex-wrap items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {playerData.dateOfBirth ? `${playerData.dateOfBirth} (${age} years)` : 'Date of Birth not set'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className={`text-lg ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Cricket Player
                    </span>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={playerData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiSave className="text-lg" /> Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        darkMode 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <FiX className="text-lg" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiEdit2 className="text-lg" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Batting & Bowling Details */}
            <Card className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-white/20'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <FiTarget className="text-white text-xl" />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Batting & Bowling Details
                </h3>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Batting Style
                    </label>
                    <Select
                      name="battingStyle"
                      value={playerData.battingStyle}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    >
                      <option value="">Select batting style</option>
                      {battingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bowling Style
                    </label>
                    <Select
                      name="bowlingStyle"
                      value={playerData.bowlingStyle}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    >
                      <option value="">Select bowling style</option>
                      {bowlingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bowler Type
                    </label>
                    <Select
                      name="bowlerType"
                      value={playerData.bowlerType}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    >
                      <option value="">Select bowler type</option>
                      {bowlerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Batting Style</p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.battingStyle || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Bowling Style</p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.bowlingStyle || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Bowler Type</p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.bowlerType || 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Physical Attributes */}
            <Card className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-white/20'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <FiActivity className="text-white text-xl" />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Physical Attributes
                </h3>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      name="height"
                      value={playerData.height}
                      onChange={handleInputChange}
                      placeholder="Enter height in cm"
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      name="weight"
                      value={playerData.weight}
                      onChange={handleInputChange}
                      placeholder="Enter weight in kg"
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Height</p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.height ? `${playerData.height} cm` : 'Not specified'}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Weight</p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.weight ? `${playerData.weight} kg` : 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Contact Information */}
            <Card className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-white/20'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <FiPhone className="text-white text-xl" />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Contact Information
                </h3>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phoneNumber"
                      value={playerData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <TextArea
                      name="address"
                      value={playerData.address}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter your address"
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                          : 'bg-white border-gray-300 focus:border-blue-400'
                      }`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <FiPhone className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                    </div>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.phoneNumber || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <FiMapPin className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                    </div>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {playerData.address || 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </Card>
            
            {/* About Section */}
            <Card className={`rounded-2xl shadow-xl p-6 backdrop-blur-sm ${
              darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-white/20'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
                  <FiUser className="text-white text-xl" />
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  About Me
                </h3>
              </div>
              
              {isEditing ? (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <TextArea
                    name="bio"
                    value={playerData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' 
                        : 'bg-white border-gray-300 focus:border-blue-400'
                    }`}
                  />
                </div>
              ) : (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {playerData.bio || 'No bio added yet. Share something about yourself!'}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;