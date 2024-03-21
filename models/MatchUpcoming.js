const mongoose = require('mongoose');

const MatchUpcomingSchema = new mongoose.Schema({
  id: {
    type: String
  },
  status: {
    type: String
  },
  homeTeam: {
    type: Number
  },
  awayTeam: {
    type: Number
  },
  stat: {
    type: Object
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model('matchupcoming', MatchUpcomingSchema);
