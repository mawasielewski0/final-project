const express = require('express');
const unirest = require('unirest');
function createFavoritesRouter(dbClient) {
  const router = express.Router();
  const db = dbClient.db('FavoritesDB');
  const favoritesCollection = db.collection('favorites');

  router.use(express.urlencoded({ extended: true }));

  router.get('/', async (req, res) => {
    try {
      const memories = await favoritesCollection.find({}).toArray();
      res.render('favoritesPage', { favorites: memories }); 
    } catch (err) {
      console.error('Database read error:', err);
      res.status(500).send('Database error');
    }
  });

  router.post('/add', async (req, res) => {
    const teamName = req.body.teamName?.trim();
    const season = req.body.season?.trim();
    const reason = req.body.reason?.trim();

    if (!teamName || !season || !reason) {
      const memories = await favoritesCollection.find({}).toArray();
      return res.render('favoritesPage', { favorites: memories, error: 'Please fill all fields.' });
    }

    const memoryData = { teamName, season, reason };

    try {
      await favoritesCollection.insertOne(memoryData);
      const memories = await favoritesCollection.find({}).toArray();
      res.render('favoritesPage', { favorites: memories });
    } catch (dbErr) {
      console.error('Database error:', dbErr);
      res.status(500).send('Database error');
    }
  });

  return router;
}

module.exports = createFavoritesRouter;


