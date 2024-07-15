const mongoose = require('mongoose');
const pageSchema = new mongoose.Schema({

  url: { type: String, required: true, unique: true },
  status: { type: String, default: 'Por Avaliar' },
  dateAdded: { type: Date, default: Date.now },
  lastReportDate: { type: Date },
  aErrors: {type : Number, default: -1},
  aaErrors: {type: Number, default: -1},
  aaaErrors: {type :Number, default: -1}
});


module.exports = mongoose.model('Page', pageSchema);
