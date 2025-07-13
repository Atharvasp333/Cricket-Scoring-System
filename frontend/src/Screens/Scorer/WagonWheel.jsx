import React, { useState } from 'react';

const WagonWheel = ({ onShotSelect, selectedShot, isVisible, onClose }) => {
  // Enhanced field positions with proper spacing and avoiding overlaps
  const fieldPositions = [
    // Behind wicket (0°)
    { id: 'wicket-keeper', angle: 0, distance: 30, label: 'Wicket Keeper', region: 'behind' },
    { id: 'first-slip', angle: 15, distance: 35, label: 'First Slip', region: 'behind' },
    { id: 'second-slip', angle: -15, distance: 35, label: 'Second Slip', region: 'behind' },
    { id: 'third-slip', angle: 30, distance: 35, label: 'Third Slip', region: 'behind' },
    { id: 'gully', angle: 45, distance: 45, label: 'Gully', region: 'behind' },
    { id: 'deep-gully', angle: 50, distance: 70, label: 'Deep Gully', region: 'behind' },
    
    // Fine leg side (45° - 135°) - Right side from batsman's perspective
    { id: 'long-stop', angle: 0, distance: 85, label: 'Long Stop', region: 'leg' },
    { id: 'fine-leg', angle: 55, distance: 85, label: 'Fine Leg', region: 'leg' },
    { id: 'deep-fine-leg', angle: 60, distance: 95, label: 'Deep Fine Leg', region: 'leg' },
    { id: 'short-fine-leg', angle: 65, distance: 50, label: 'Short Fine Leg', region: 'leg' },
    { id: 'deep-backward-square-leg', angle: 75, distance: 95, label: 'Deep Backward Square Leg', region: 'leg' },
    { id: 'deep-square-leg', angle: 85, distance: 95, label: 'Deep Square Leg', region: 'leg' },
    { id: 'backward-square-leg', angle: 95, distance: 70, label: 'Backward Square Leg', region: 'leg' },
    
    // Square leg to mid wicket (90° - 135°)
    { id: 'square-leg', angle: 105, distance: 60, label: 'Square Leg', region: 'leg' },
    { id: 'short-leg', angle: 110, distance: 30, label: 'Short Leg', region: 'leg' },
    { id: 'leg-slip', angle: 115, distance: 25, label: 'Leg Slip', region: 'leg' },
    { id: 'forward-square-leg', angle: 125, distance: 70, label: 'Forward Square Leg', region: 'leg' },
    { id: 'deep-forward-square-leg', angle: 120, distance: 95, label: 'Deep Forward Square Leg', region: 'leg' },
    { id: 'mid-wicket', angle: 135, distance: 70, label: 'Mid Wicket', region: 'leg' },
    { id: 'short-mid-wicket', angle: 135, distance: 40, label: 'Short Mid Wicket', region: 'leg' },
    
    // Mid wicket to long on (135° - 180°)
    { id: 'deep-mid-wicket', angle: 140, distance: 95, label: 'Deep Mid Wicket', region: 'leg' },
    { id: 'cow-corner', angle: 150, distance: 95, label: 'Cow Corner', region: 'leg' },
    { id: 'long-on', angle: 160, distance: 95, label: 'Long On', region: 'straight' },
    { id: 'mid-on', angle: 170, distance: 60, label: 'Mid On', region: 'straight' },
    { id: 'short-mid-on', angle: 165, distance: 40, label: 'Short Mid On', region: 'straight' },
    
    // Straight (180°)
    { id: 'straight', angle: 180, distance: 95, label: 'Straight', region: 'straight' },
    
    // Mid off to long off (180° - 225°)
    { id: 'short-mid-off', angle: 195, distance: 40, label: 'Short Mid Off', region: 'straight' },
    { id: 'mid-off', angle: 190, distance: 60, label: 'Mid Off', region: 'straight' },
    { id: 'long-off', angle: 200, distance: 95, label: 'Long Off', region: 'straight' },
    { id: 'wide-long-off', angle: 210, distance: 95, label: 'Wide Long Off', region: 'off' },
    
    // Covers (225° - 270°) - Left side from batsman's perspective
    { id: 'extra-cover', angle: 225, distance: 70, label: 'Extra Cover', region: 'off' },
    { id: 'deep-extra-cover', angle: 225, distance: 95, label: 'Deep Extra Cover', region: 'off' },
    { id: 'short-extra-cover', angle: 220, distance: 45, label: 'Short Extra Cover', region: 'off' },
    { id: 'cover', angle: 240, distance: 70, label: 'Cover', region: 'off' },
    { id: 'deep-cover', angle: 240, distance: 95, label: 'Deep Cover', region: 'off' },
    { id: 'short-cover', angle: 235, distance: 45, label: 'Short Cover', region: 'off' },
    
    // Point area (270° - 315°) - Avoiding overlap with OFF SIDE text
    { id: 'cover-point', angle: 255, distance: 60, label: 'Cover Point', region: 'off' },
    { id: 'deep-cover-point', angle: 255, distance: 90, label: 'Deep Cover Point', region: 'off' },
    { id: 'point', angle: 280, distance: 60, label: 'Point', region: 'off' },
    { id: 'deep-point', angle: 280, distance: 90, label: 'Deep Point', region: 'off' },
    { id: 'backward-point', angle: 300, distance: 60, label: 'Backward Point', region: 'off' },
    { id: 'deep-backward-point', angle: 300, distance: 90, label: 'Deep Backward Point', region: 'off' },
    { id: 'short-point', angle: 285, distance: 40, label: 'Short Point', region: 'off' },
    { id: 'silly-point', angle: 290, distance: 15, label: 'Silly Point', region: 'off' },
    
    // Third man area (315° - 360°)
    { id: 'third-man', angle: 315, distance: 85, label: 'Third Man', region: 'off' },
    { id: 'deep-third-man', angle: 320, distance: 95, label: 'Deep Third Man', region: 'off' },
    { id: 'short-third-man', angle: 330, distance: 50, label: 'Short Third Man', region: 'off' },
    { id: 'fly-slip', angle: 340, distance: 70, label: 'Fly Slip', region: 'off' },
    
    // Additional deep positions
    { id: 'deep-mid-on', angle: 155, distance: 90, label: 'Deep Mid On', region: 'straight' },
    { id: 'deep-mid-off', angle: 205, distance: 90, label: 'Deep Mid Off', region: 'straight' },
    
    // Silly positions - corrected angles to be more accurate
    { id: 'silly-mid-off', angle: 190, distance: 15, label: 'Silly Mid Off', region: 'straight' },
    { id: 'silly-mid-on', angle: 170, distance: 15, label: 'Silly Mid On', region: 'straight' },
    { id: 'silly-cover', angle: 245, distance: 15, label: 'Silly Cover', region: 'off' },
    
    // Boundary positions
    { id: 'long-leg', angle: 70, distance: 95, label: 'Long Leg', region: 'leg' },
    { id: 'sweeper', angle: 250, distance: 95, label: 'Sweeper', region: 'off' }
  ];

  const [hoveredPosition, setHoveredPosition] = useState(null);

  const handlePositionClick = (position) => {
    onShotSelect(position);
  };

  const getPositionColor = (position) => {
    if (selectedShot && selectedShot.id === position.id) {
      return '#ef4444'; // Red for selected
    }
    if (hoveredPosition === position.id) {
      return '#3b82f6'; // Blue for hovered
    }
    switch (position.region) {
      case 'off':
        return '#10b981'; // Green for off side
      case 'leg':
        return '#f59e0b'; // Orange for leg side
      case 'straight':
        return '#8b5cf6'; // Purple for straight
      case 'behind':
        return '#6b7280'; // Gray for behind wicket
      default:
        return '#6b7280';
    }
  };

  // Convert angle and distance to x,y coordinates
  const getPositionCoordinates = (angle, distance) => {
    const centerX = 50;
    const centerY = 50;
    const maxRadius = 45; // Maximum distance from center
    const normalizedDistance = (distance / 100) * maxRadius;
    
    // Convert angle to radians and adjust for coordinate system
    const radians = (angle * Math.PI) / 180;
    const x = centerX + normalizedDistance * Math.sin(radians);
    const y = centerY - normalizedDistance * Math.cos(radians);
    
    return { x, y };
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Select Shot Direction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Off Side</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span>Leg Side</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span>Straight</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <span>Behind Wicket</span>
          </div>
        </div>

        {/* Cricket Field */}
        <div className="relative bg-green-100 rounded-lg p-4" style={{ height: '600px' }}>
          {/* Outer boundary circle */}
          <div className="absolute inset-4 border-2 border-gray-400 rounded-full"></div>
          
          {/* Inner circle (30-yard circle) */}
          <div 
            className="absolute border border-gray-300 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: '60%',
              height: '60%',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>

          {/* Pitch at center */}
          <div 
            className="absolute bg-yellow-200 border border-gray-400 rounded-sm"
            style={{
              left: '50%',
              top: '50%',
              width: '40px',
              height: '80px',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>

          {/* Wickets */}
          <div 
            className="absolute bg-brown-600"
            style={{
              left: '50%',
              top: '44%',
              width: '3px',
              height: '12px',
              transform: 'translateX(-50%)'
            }}
          ></div>
          <div 
            className="absolute bg-brown-600"
            style={{
              left: '50%',
              top: '56%',
              width: '3px',
              height: '12px',
              transform: 'translateX(-50%)'
            }}
          ></div>

          {/* Batsman position indicator at striker's end (corrected to be at the bottom of the pitch) */}
          <div 
            className="absolute bg-blue-600 rounded-full"
            style={{
              left: '50%',
              top: '58%',
              width: '10px',
              height: '10px',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>

          {/* Field positions */}
          {fieldPositions.map((position) => {
            const coords = getPositionCoordinates(position.angle, position.distance);
            
            return (
              <div
                key={position.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`
                }}
                onClick={() => handlePositionClick(position)}
                onMouseEnter={() => setHoveredPosition(position.id)}
                onMouseLeave={() => setHoveredPosition(null)}
              >
                {/* Position dot - uniform size */}
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-lg"
                  style={{
                    backgroundColor: getPositionColor(position)
                  }}
                ></div>
                
                {/* Position label */}
                <div 
                  className="absolute text-xs font-medium text-gray-700 bg-white px-1 py-0.5 rounded shadow-md whitespace-nowrap z-10"
                  style={{
                    left: '50%',
                    top: '100%',
                    transform: 'translateX(-50%)',
                    marginTop: '4px',
                    display: hoveredPosition === position.id || (selectedShot && selectedShot.id === position.id) ? 'block' : 'none'
                  }}
                >
                  {position.label}
                </div>
              </div>
            );
          })}

          {/* Field side labels - Positioned to avoid overlap */}
          <div className="absolute text-sm font-bold text-gray-600" style={{ right: '12%', top: '50%', transform: 'translateY(-50%)' }}>
            LEG SIDE
          </div>
          <div className="absolute text-sm font-bold text-gray-600" style={{ left: '12%', top: '50%', transform: 'translateY(-50%)' }}>
            OFF SIDE
          </div>
        </div>

        {/* Selected shot info */}
        {selectedShot && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-medium text-blue-800">
              Selected: {selectedShot.label} ({selectedShot.region} side)
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          {selectedShot && (
            <button
              onClick={() => {
                onShotSelect(selectedShot);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Confirm Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WagonWheel;