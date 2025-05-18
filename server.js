require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nbaStats')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));