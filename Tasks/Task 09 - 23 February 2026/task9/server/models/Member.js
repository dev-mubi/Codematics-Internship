const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  issuedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IssueRecord'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
