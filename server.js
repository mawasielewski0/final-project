require('dotenv').config();
const express = require('express');
const unirest = require('unirest');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

const dbClient = new MongoClient(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createFavoritesRouter = require('./routes/favorites');

async function connectDB() {
  await dbClient.connect();
  console.log('Connected to MongoDB');
}

connectDB().then(() => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'pages'));
  app.use(express.static('public'));

  app.get('/', (req, res) => res.render('mainPage'));

  app.get('/leaderboards', async (req, res) => {
    const reqApi = unirest('GET', 'https://api-nba-v1.p.rapidapi.com/standings');
    reqApi.query({
      league: 'standard',
      season: '2024'
    });
    reqApi.headers({
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
      'x-rapidapi-key': process.env.API_KEY
    });
    reqApi.end(function (apiRes) {
      const allTeams = apiRes.body.response;
      const easternConference = allTeams.filter(team => team.conference.name === 'east');
      const westernConference = allTeams.filter(team => team.conference.name === 'west');

      easternConference.sort((a, b) => a.conference.rank - b.conference.rank);
      westernConference.sort((a, b) => a.conference.rank - b.conference.rank);

      res.render('leaderboardsPage', {
        easternConference,
        westernConference
      });
    });
  });

  const favoritesRouter = createFavoritesRouter(dbClient);
  app.use('/favorites', favoritesRouter);

  app.use((req, res) => {
    res.status(404).send('Page not found');
  });

  console.log('Server ready. API key loaded:', process.env.API_KEY);

  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
