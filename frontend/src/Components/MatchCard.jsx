import React from 'react';
import { Calendar, Clock, MapPin, User, Shield, Users, AlertCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const MatchCard = ({ 
  match, 
  isUserRegistered = false, 
  isUserCaptain = false,
  userTeam = null,
  onRegister = null
}) => {
  // Format match date and time
  const matchDate = match.date ? new Date(match.date) : new Date();
  const formattedDate = format(matchDate, 'MMM d, yyyy');
  const formattedTime = format(matchDate, 'h:mm a');
  
  // Get team names and captains
  const team1Name = match.team1_name || 'Team 1';
  const team2Name = match.team2_name || 'Team 2';
  const team1Captain = match.team1_captain?.name || 'Captain';
  const team2Captain = match.team2_captain?.name || 'Captain';
  const team1CaptainContact = match.team1_captain?.contact || 'N/A';
  const team2CaptainContact = match.team2_captain?.contact || 'N/A';
  
  // Count players in each team
  const team1PlayerCount = (match.team1_players?.length || 0) + (match.team1_captain ? 1 : 0);
  const team2PlayerCount = (match.team2_players?.length || 0) + (match.team2_captain ? 1 : 0);
  
  // Get match status badge
  const getStatusBadge = () => {
    switch(match.status) {
      case 'Live':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
            LIVE
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            UPCOMING
          </span>
        );
    }
  };
  
  // Handle register button click
  const handleRegister = (team) => {
    if (onRegister && typeof onRegister === 'function') {
      onRegister(match, team);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{team1Name} vs {team2Name}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="mt-2 flex items-center text-sm text-blue-100">
          <Calendar size={14} className="mr-1.5" />
          <span className="mr-4">{formattedDate}</span>
          <Clock size={14} className="mr-1.5" />
          <span>{formattedTime}</span>
        </div>
        
        {match.location && (
          <div className="mt-1 flex items-center text-sm text-blue-100">
            <MapPin size={14} className="mr-1.5" />
            <span>{match.location}</span>
          </div>
        )}
      </div>
      
      {/* Team 1 Info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-800">{team1Name}</h4>
          <span className="text-sm text-gray-500">{team1PlayerCount} players</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Shield size={14} className="mr-1.5 text-amber-500" />
          <span className="font-medium">Captain:</span>
          <span className="ml-1">{team1Captain}</span>
          {team1CaptainContact && team1CaptainContact !== 'N/A' && (
            <a 
              href={`tel:${team1CaptainContact}`}
              className="ml-2 text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {team1CaptainContact}
            </a>
          )}
        </div>
        
        {!isUserRegistered && onRegister && match.status === 'Upcoming' && (
          <button
            onClick={() => handleRegister({
              team: 'team1',
              name: team1Name,
              players: match.team1_players || [],
              captain: match.team1_captain
            })}
            className="mt-2 w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-md border border-blue-200 transition-colors flex items-center justify-center"
          >
            <User size={14} className="mr-1.5" />
            Join {team1Name}
          </button>
        )}
        
        {isUserRegistered && userTeam === 'team1' && (
          <div className="mt-2 text-sm text-green-600 font-medium flex items-center">
            <Users size={14} className="mr-1.5" />
            {isUserCaptain ? 'You are the captain' : 'Registered'}
          </div>
        )}
      </div>
      
      {/* Team 2 Info */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-800">{team2Name}</h4>
          <span className="text-sm text-gray-500">{team2PlayerCount} players</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Shield size={14} className="mr-1.5 text-amber-500" />
          <span className="font-medium">Captain:</span>
          <span className="ml-1">{team2Captain}</span>
          {team2CaptainContact && team2CaptainContact !== 'N/A' && (
            <a 
              href={`tel:${team2CaptainContact}`}
              className="ml-2 text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {team2CaptainContact}
            </a>
          )}
        </div>
        
        {!isUserRegistered && onRegister && match.status === 'Upcoming' && (
          <button
            onClick={() => handleRegister({
              team: 'team2',
              name: team2Name,
              players: match.team2_players || [],
              captain: match.team2_captain
            })}
            className="mt-2 w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-md border border-blue-200 transition-colors flex items-center justify-center"
          >
            <User size={14} className="mr-1.5" />
            Join {team2Name}
          </button>
        )}
        
        {isUserRegistered && userTeam === 'team2' && (
          <div className="mt-2 text-sm text-green-600 font-medium flex items-center">
            <Users size={14} className="mr-1.5" />
            {isUserCaptain ? 'You are the captain' : 'Registered'}
          </div>
        )}
      </div>
      
      {/* Match Details Link */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <a 
          href={`/matches/${match._id}`}
          className="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          View match details
          <ChevronRight size={16} />
        </a>
      </div>
      
      {/* Special Notices */}
      {match.special_notes && (
        <div className="px-4 py-2 bg-amber-50 text-amber-800 text-sm flex items-start">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5 mr-1.5 text-amber-500" />
          <p>{match.special_notes}</p>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
