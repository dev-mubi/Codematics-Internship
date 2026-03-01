const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    default: 'issued'
  },
  fine: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('IssueRecord', issueRecordSchema);
