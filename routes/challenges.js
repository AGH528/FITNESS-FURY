const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');

router.get('/logactivity', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    const healthyWeightChallenge = await Challenge.findOne({ name: 'Healthy Weight Challenge' });

    res.render('logactivity', { challenges, healthyWeightChallenge });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.render('index', { challenges });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).send('Challenge not found');
    }

    res.render('challengeDetails', { challenge });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/log', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (isNaN(progress) || progress <= 0) {
    return res.status(400).send('Invalid progress input');
  }

  const activityCalories = calculateCalories(id, progress);

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).send('Challenge not found');
    }

    const newLog = {
      amount: parseInt(progress),
      date: new Date(),
      caloriesBurned: activityCalories, 
    };

    challenge.logs.push(newLog);
    challenge.progress += parseInt(progress);

    await challenge.save();


    const healthyWeightChallenge = await Challenge.findOne({ name: 'Healthy Weight Challenge' });
    if (healthyWeightChallenge) {
      healthyWeightChallenge.progress += activityCalories;
      await healthyWeightChallenge.save();
    }

    res.redirect('/challenges/logactivity'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


function calculateCalories(challengeId, amount) {
  const activityMap = {
    pushups: 0.5, 
    situps: 0.7,
    squats: 0.8, 
    chinups: 1.2, 
    endurance: 10, 
  };

  const activityType = getActivityTypeByChallengeId(challengeId); 
  return activityMap[activityType] ? activityMap[activityType] * amount : 0;
}

function getActivityTypeByChallengeId(challengeId) {
 
  const challengeMap = {
    pushupChallengeId: 'pushups',
    situpChallengeId: 'situps',
    squatChallengeId: 'squats',
    chinupChallengeId: 'chinups',
    enduranceChallengeId: 'endurance',
  };

  return challengeMap[challengeId] || null;
}

module.exports = router;
