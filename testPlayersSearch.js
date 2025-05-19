require('dotenv').config();
const unirest = require('unirest');

async function testPlayerSearch(playerName) {
  return new Promise((resolve, reject) => {
    const req = unirest('GET', 'https://api-nba-v1.p.rapidapi.com/players');

    // Adjust query params based on your API docs & testing
    req.query({
      team: '30',
      season: '2023',
      search: playerName // try full name or last name
    });

    req.headers({
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': process.env.API_KEY
    });

    req.end((res) => {
      if (res.error) {
        reject(res.error);
      } else {
        resolve(res.body);
      }
    });
  });
}

// Run test
(async () => {
  try {
    const playerName = 'Anthony Davis'; // change to test other names
    console.log(`Searching for player: ${playerName}`);

    const data = await testPlayerSearch(playerName);

    console.log('API response:', JSON.stringify(data, null, 2));

    // If you want, check if any players found:
    if (data.response && data.response.length > 0) {
      console.log('Players found:', data.response.length);
      data.response.forEach((player, i) => {
        console.log(`${i + 1}. ${player.firstname} ${player.lastname} - Team: ${player.team?.name || 'N/A'}`);
      });
    } else {
      console.log('No players found.');
    }

  } catch (err) {
    console.error('Error calling API:', err);
  }
})();
