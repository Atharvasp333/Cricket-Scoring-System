import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Fixed import path
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Fixed import path
import { FiEdit2, FiSave, FiCalendar, FiUser } from 'react-icons/fi';

const PlayerProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Added darkMode state
  const [playerData, setPlayerData] = useState({
    fullName: '',
    dateOfBirth: '',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm',
    bowlerType: 'Medium',
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
          const docRef = doc(db, 'players', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPlayerData({
              fullName: data.fullName || currentUser.displayName || '',
              dateOfBirth: data.dateOfBirth || '',
              battingStyle: data.battingStyle || 'Right-handed',
              bowlingStyle: data.bowlingStyle || 'Right-arm',
              bowlerType: data.bowlerType || 'Medium',
              height: data.height || '',
              weight: data.weight || '',
              teams: data.teams || [],
              bio: data.bio || '',
              phoneNumber: data.phoneNumber || '',
              address: data.address || ''
            });
            
            if (data.dateOfBirth) {
              calculateAge(data.dateOfBirth);
            }
          } else {
            // If no player document exists, create one with default values
            const defaultData = {
              fullName: currentUser.displayName || '',
              dateOfBirth: '',
              battingStyle: 'Right-handed',
              bowlingStyle: 'Right-arm',
              bowlerType: 'Medium',
              height: '',
              weight: '',
              teams: [],
              bio: '',
              phoneNumber: '',
              address: '',
              email: currentUser.email,
              createdAt: new Date().toISOString()
            };
            
            await setDoc(docRef, defaultData);
            setPlayerData(defaultData);
          }
        } catch (error) {
          console.error('Error fetching player data:', error);
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
        const playerRef = doc(db, 'players', currentUser.uid);
        const updatedData = {
          ...playerData,
          updatedAt: new Date().toISOString()
        };
        await updateDoc(playerRef, updatedData);
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Dark mode toggle */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded transition ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="relative">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Player" 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-600"
                />
              ) : (
                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-4xl ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                  <FiUser />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={playerData.fullName}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              ) : (
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-[#16638A]'}`}>
                  {playerData.fullName || 'Player Name'}
                </h2>
              )}
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center">
                  <FiCalendar className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {playerData.dateOfBirth ? `${playerData.dateOfBirth} (${age} years)` : 'Date of Birth not set'}
                  </span>
                </div>
              </div>
              
              {isEditing && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={playerData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              )}
            </div>
            
            <div>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  <FiSave /> Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-[#16638A]'}`}>
                Batting & Bowling Details
              </h3>
              
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Batting Style
                    </label>
                    <select
                      name="battingStyle"
                      value={playerData.battingStyle}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {battingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bowling Style
                    </label>
                    <select
                      name="bowlingStyle"
                      value={playerData.bowlingStyle}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {bowlingStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bowler Type
                    </label>
                    <select
                      name="bowlerType"
                      value={playerData.bowlerType}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    >
                      {bowlerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Batting Style</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{playerData.battingStyle}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bowling Style</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{playerData.bowlingStyle}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bowler Type</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{playerData.bowlerType}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-[#16638A]'}`}>
                Physical Attributes
              </h3>
              
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={playerData.height}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={playerData.weight}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Height</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                      {playerData.height ? `${playerData.height} cm` : 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Weight</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                      {playerData.weight ? `${playerData.weight} kg` : 'Not specified'}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-[#16638A]'}`}>
                Contact Information
              </h3>
              
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={playerData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={playerData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                      {playerData.phoneNumber || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Address</p>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                      {playerData.address || 'Not specified'}
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-[#16638A]'}`}>
                About
              </h3>
              
              {isEditing ? (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={playerData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                </div>
              ) : (
                <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                  {playerData.bio || 'No bio added yet.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;