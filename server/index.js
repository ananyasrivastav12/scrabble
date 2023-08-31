import chalkAnimation from 'chalk-animation';
import { database } from './database.js';
import express from 'express';
import logger from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('client'));

app.post('/wordScore', async (req, res) => {
  const { name, word, score } = req.body;
  await database.saveWordScore(name, word, score);
  console.log(name, word, score);
  res.status(200).json({ message: 'Success' });
});

app.get('/highestWordScores', async (req, res) => {
  const scores = await database.top10WordScores();
  res.status(200).json(scores);
});

app.post('/gameScore', async (req, res) => {
  const { name, score } = req.body;
  await database.saveGameScore(name, score);
  res.status(200).json({ message: 'Success' });
});

app.get('/highestGameScores', async (req, res) => {
  const scores = await database.top10GameScores();
  res.status(200).json(scores);
});


app.all('*', async (req, res) => {
  res.status(404).send(`Not found: ${req.path}`);
});

// Start the server.
app.listen(port, () => {
  const banner = `
  .d8888b.                            888      888      888          
  d88P  Y88b                           888      888      888          
  Y88b.                                888      888      888          
   "Y888b.    .d8888b 888d888  8888b.  88888b.  88888b.  888  .d88b.  
      "Y88b. d88P"    888P"       "88b 888 "88b 888 "88b 888 d8P  Y8b 
        "888 888      888     .d888888 888  888 888  888 888 88888888 
  Y88b  d88P Y88b.    888     888  888 888 d88P 888 d88P 888 Y8b.     
   "Y8888P"   "Y8888P 888     "Y888888 88888P"  88888P"  888  "Y8888                                                                       
`;
  const msg = `${banner}\n     Server started on http://localhost:${port}`;
  const rainbow = chalkAnimation.rainbow(msg);

  // Have the rainbow stop so we can log stuff to the console.
  setTimeout(() => {
    rainbow.stop(); // Animation stops
  }, 2000);
});
