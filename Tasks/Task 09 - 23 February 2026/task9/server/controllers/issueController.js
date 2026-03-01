const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');
const Member = require('../models/Member');

// @desc    Get all issue records
// @route   GET /api/issues
exports.getIssues = async (req, res) => {
  try {
    const issues = await IssueRecord.find()
      .populate('bookId', 'title bookId')
      .populate('memberId', 'name memberId')
      .sort({ issueDate: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get issue records by memberId (Custom ID or ObjectId)
// @route   GET /api/issues/member/:memberId
exports.getIssuesByMember = async (req, res) => {
  try {
    const memberIdParam = req.params.memberId;
    let member;
    
    if (memberIdParam.match(/^[0-9a-fA-F]{24}$/)) {
        member = await Member.findById(memberIdParam);
    }
    
    if (!member) {
        member = await Member.findOne({ memberId: memberIdParam });
    }

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const issues = await IssueRecord.find({ memberId: member._id })
      .populate('bookId', 'title bookId')
      .populate('memberId', 'name memberId')
      .sort({ issueDate: -1 });
      
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Issue a book
// @route   POST /api/issues/issue
exports.issueBook = async (req, res) => {
  try {
    const { memberId, bookId, dueDate } = req.body;

    if (!memberId || !bookId) {
      return res.status(400).json({ message: 'Member ID and Book ID are required' });
    }

    // Resolve Book
    let book = null;
    if (bookId.match(/^[0-9a-fA-F]{24}$/)) {
        book = await Book.findById(bookId);
    }
    if (!book) book = await Book.findOne({ bookId: bookId });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check availability
    if (book.quantity <= 0 || !book.availabilityStatus) {
      return res.status(400).json({ message: 'Book not available' });
    }

    // Resolve Member
    let member = null;
    if (memberId.match(/^[0-9a-fA-F]{24}$/)) {
        member = await Member.findById(memberId);
    }
    if (!member) member = await Member.findOne({ memberId: memberId });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Ensure book hasn't already been issued to the same member and not returned
    const existingIssue = await IssueRecord.findOne({
      memberId: member._id,
      bookId: book._id,
      status: 'issued'
    });

    if (existingIssue) {
        return res.status(400).json({ message: 'Book is already issued to this member' });
    }

    // Set dates
    const issueDate = new Date();
    // Default 14 days if not provided
    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    // Create Issue Record
    const issueRecord = await IssueRecord.create({
      issueId: `ISS-${Date.now()}`,
      bookId: book._id,
      memberId: member._id,
      issueDate,
      dueDate: due,
      status: 'issued'
    });

    // Update Book
    book.quantity -= 1;
    if (book.quantity === 0) {
      book.availabilityStatus = false;
    }
    await book.save();

    // Update Member
    member.issuedBooks.push(issueRecord._id);
    await member.save();

    res.status(201).json(await issueRecord.populate(['bookId', 'memberId']));
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/issues/return/:issueId
exports.returnBook = async (req, res) => {
  try {
    const issueIdParam = req.params.issueId;
    
    // Find record by Object ID or custom issueId
    let issueRecord = null;
    if (issueIdParam.match(/^[0-9a-fA-F]{24}$/)) {
        issueRecord = await IssueRecord.findById(issueIdParam);
    }
    if (!issueRecord) {
        issueRecord = await IssueRecord.findOne({ issueId: issueIdParam });
    }

    if (!issueRecord) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issueRecord.status === 'returned') {
      return res.status(400).json({ message: 'Book is already returned' });
    }

    const returnDate = new Date();
    let fine = 0;

    // Calculate fine: 5 unit per day overdue
    if (returnDate > issueRecord.dueDate) {
      // difference in time
      const diffTime = Math.abs(returnDate - issueRecord.dueDate);
      // difference in days
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fine = diffDays * 5;
    }

    // Update IssueRecord
    issueRecord.status = 'returned';
    issueRecord.returnDate = returnDate;
    issueRecord.fine = fine;
    await issueRecord.save();

    // Update Book
    const book = await Book.findById(issueRecord.bookId);
    if (book) {
      book.quantity += 1;
      book.availabilityStatus = true; // Always true since quantity > 0 now
      await book.save();
    }

    // Update Member
    const member = await Member.findById(issueRecord.memberId);
    if (member) {
      member.issuedBooks = member.issuedBooks.filter(
        id => id.toString() !== issueRecord._id.toString()
      );
      await member.save();
    }

    res.json(await issueRecord.populate(['bookId', 'memberId']));
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
