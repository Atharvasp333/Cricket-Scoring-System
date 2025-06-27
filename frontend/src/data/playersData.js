export const playersData = [
    {
      id: 1,
      name: 'Rohit Sharma',
      role: 'Right-handed Batsman',
      teams: ['India', 'Mumbai Indians', 'Deccan Chargers'],
      image: 'https://example.com/rohit.jpg',
      country: 'India',
      city: 'Nagpur, Maharashtra',
      matches: [
        { id: 101, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', runs: 47, balls: 31, fours: 4, sixes: 3, strikeRate: 151.61, result: 'Lost' },
        { id: 102, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 29, balls: 18, fours: 2, sixes: 3, strikeRate: 161.11, result: 'Won' },
        { id: 103, date: '2023-11-02', opponent: 'Sri Lanka', team: 'India', format: 'ODI', runs: 87, balls: 101, fours: 10, sixes: 3, strikeRate: 86.13, result: 'Won' },
        { id: 104, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 4, balls: 16, fours: 0, sixes: 0, strikeRate: 25.00, result: 'Won' },
        { id: 105, date: '2023-10-22', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 131, balls: 84, fours: 14, sixes: 5, strikeRate: 155.95, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 9844,
        totalMatches: 243,
        highestScore: 264,
        average: 48.97,
        centuries: 30,
        halfCenturies: 48,
        strikeRate: 88.92
      }
    },
    {
      id: 2,
      name: 'Virat Kohli',
      role: 'Right-handed Batsman',
      teams: ['India', 'Royal Challengers Bangalore'],
      image: 'https://example.com/kohli.jpg',
      country: 'India',
      city: 'Delhi',
      matches: [
        { id: 201, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', runs: 54, balls: 63, fours: 4, sixes: 0, strikeRate: 85.71, result: 'Lost' },
        { id: 202, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 117, balls: 113, fours: 9, sixes: 2, strikeRate: 103.53, result: 'Won' },
        { id: 203, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', runs: 51, balls: 56, fours: 5, sixes: 1, strikeRate: 91.07, result: 'Won' },
        { id: 204, date: '2023-11-05', opponent: 'South Africa', team: 'India', format: 'ODI', runs: 101, balls: 121, fours: 10, sixes: 0, strikeRate: 83.47, result: 'Won' },
        { id: 205, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 0, balls: 9, fours: 0, sixes: 0, strikeRate: 0.00, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 12898,
        totalMatches: 275,
        highestScore: 183,
        average: 57.32,
        centuries: 50,
        halfCenturies: 68,
        strikeRate: 93.62
      }
    },
    {
      id: 3,
      name: 'Jasprit Bumrah',
      role: 'Right-arm Fast Bowler',
      teams: ['India', 'Mumbai Indians'],
      image: 'https://example.com/bumrah.jpg',
      country: 'India',
      city: 'Ahmedabad, Gujarat',
      matches: [
        { id: 301, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', wickets: 1, runsGiven: 43, overs: 10, economy: 4.30, best: '1/43', result: 'Lost' },
        { id: 302, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', wickets: 3, runsGiven: 32, overs: 10, economy: 3.20, best: '3/32', result: 'Won' },
        { id: 303, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', wickets: 2, runsGiven: 19, overs: 7, economy: 2.71, best: '2/19', result: 'Won' },
        { id: 304, date: '2023-11-05', opponent: 'South Africa', team: 'India', format: 'ODI', wickets: 2, runsGiven: 17, overs: 8, economy: 2.12, best: '2/17', result: 'Won' },
        { id: 305, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', wickets: 3, runsGiven: 32, overs: 6.5, economy: 4.68, best: '3/32', result: 'Won' },
      ],
      careerStats: {
        totalWickets: 149,
        totalMatches: 121,
        bestBowling: '6/19',
        average: 22.47,
        economy: 4.63,
        strikeRate: 31.2,
        fiveWickets: 8
      }
    },
    {
      id: 4,
      name: 'Hardik Pandya',
      role: 'All-rounder',
      teams: ['India', 'Mumbai Indians', 'Gujarat Titans'],
      image: 'https://example.com/hardik.jpg',
      country: 'India',
      city: 'Surat, Gujarat',
      matches: [
        { id: 401, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', runs: 27, balls: 17, fours: 3, sixes: 1, wickets: 1, runsGiven: 37, result: 'Lost' },
        { id: 402, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 0, balls: 2, fours: 0, sixes: 0, wickets: 0, runsGiven: 28, result: 'Won' },
        { id: 403, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', runs: 11, balls: 8, fours: 1, sixes: 0, wickets: 2, runsGiven: 19, result: 'Won' },
        { id: 404, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 16, balls: 19, fours: 1, sixes: 1, wickets: 2, runsGiven: 24, result: 'Won' },
        { id: 405, date: '2023-10-22', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 22, balls: 15, fours: 2, sixes: 1, wickets: 1, runsGiven: 34, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 1758,
        totalWickets: 76,
        totalMatches: 87,
        highestScore: 92,
        battingAverage: 32.55,
        bowlingAverage: 38.24,
        strikeRate: 114.72,
        economy: 5.61
      }
    },
    {
      id: 5,
      name: 'Suryakumar Yadav',
      role: 'Right-handed Batsman',
      teams: ['India', 'Mumbai Indians'],
      image: 'https://example.com/surya.jpg',
      country: 'India',
      city: 'Mumbai, Maharashtra',
      matches: [
        { id: 501, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', runs: 18, balls: 28, fours: 1, sixes: 0, strikeRate: 64.28, result: 'Lost' },
        { id: 502, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 2, balls: 4, fours: 0, sixes: 0, strikeRate: 50.00, result: 'Won' },
        { id: 503, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', runs: 71, balls: 49, fours: 6, sixes: 4, strikeRate: 144.89, result: 'Won' },
        { id: 504, date: '2023-11-05', opponent: 'South Africa', team: 'India', format: 'ODI', runs: 22, balls: 14, fours: 3, sixes: 1, strikeRate: 157.14, result: 'Won' },
        { id: 505, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 49, balls: 47, fours: 4, sixes: 1, strikeRate: 104.25, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 2141,
        totalMatches: 60,
        highestScore: 117,
        average: 44.60,
        centuries: 4,
        halfCenturies: 17,
        strikeRate: 136.27
      }
    },
    {
      id: 6,
      name: 'Shubman Gill',
      role: 'Right-handed Batsman',
      teams: ['India', 'Gujarat Titans'],
      image: 'https://example.com/gill.jpg',
      country: 'India',
      city: 'Fazilka, Punjab',
      matches: [
        { id: 601, date: '2023-11-19', opponent: 'Australia', team: 'India', format: 'ODI', runs: 4, balls: 7, fours: 1, sixes: 0, strikeRate: 57.14, result: 'Lost' },
        { id: 602, date: '2023-11-15', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 80, balls: 66, fours: 8, sixes: 3, strikeRate: 121.21, result: 'Won' },
        { id: 603, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', runs: 51, balls: 32, fours: 3, sixes: 4, strikeRate: 159.37, result: 'Won' },
        { id: 604, date: '2023-11-05', opponent: 'South Africa', team: 'India', format: 'ODI', runs: 23, balls: 24, fours: 5, sixes: 0, strikeRate: 95.83, result: 'Won' },
        { id: 605, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 9, balls: 9, fours: 2, sixes: 0, strikeRate: 100.00, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 2271,
        totalMatches: 44,
        highestScore: 208,
        average: 61.37,
        centuries: 6,
        halfCenturies: 13,
        strikeRate: 103.46
      }
    },
   {
      id: 7,
      name: 'Tilak Varma',
      role: 'Left-handed Batsman',
      teams: ['India', 'Mumbai Indians'],
      image: 'https://example.com/tilak.jpg',
      country: 'India',
      city: 'Hyderabad, Telangana',
      matches: [
        { id: 701, date: '2023-11-12', opponent: 'Netherlands', team: 'India', format: 'ODI', runs: 12, balls: 18, fours: 1, sixes: 0, strikeRate: 66.66, result: 'Won' },
        { id: 702, date: '2023-10-29', opponent: 'England', team: 'India', format: 'ODI', runs: 21, balls: 29, fours: 2, sixes: 0, strikeRate: 72.41, result: 'Won' },
        { id: 703, date: '2023-10-22', opponent: 'New Zealand', team: 'India', format: 'ODI', runs: 5, balls: 8, fours: 1, sixes: 0, strikeRate: 62.50, result: 'Won' },
        { id: 704, date: '2023-09-15', opponent: 'Australia', team: 'India', format: 'T20', runs: 31, balls: 24, fours: 3, sixes: 1, strikeRate: 129.16, result: 'Lost' },
        { id: 705, date: '2023-09-12', opponent: 'South Africa', team: 'India', format: 'T20', runs: 29, balls: 20, fours: 2, sixes: 2, strikeRate: 145.00, result: 'Won' },
      ],
      careerStats: {
        totalRuns: 336,
        totalMatches: 16,
        highestScore: 51,
        average: 33.60,
        halfCenturies: 3,
        strikeRate: 138.27
      }
    }
];

