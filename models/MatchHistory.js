const mongoose = require('mongoose');

const MatchHistorySchema = new mongoose.Schema({
  status: {
    type: Object
  },
  stat: {
    type: Object
  },
  date: {
    type: String
  }
});

module.exports = mongoose.model('matchhistory', MatchHistorySchema);
