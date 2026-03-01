const Member = require('../models/Member');
const IssueRecord = require('../models/IssueRecord');

// @desc    Get all members
// @route   GET /api/members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().populate({
      path: 'issuedBooks',
      populate: { path: 'bookId', select: 'title' }
    }).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
exports.getMemberById = async (req, res) => {
  try {
    const id = req.params.id;
    let member;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      member = await Member.findById(id).populate('issuedBooks');
    }
    if (!member) {
      member = await Member.findOne({ memberId: id }).populate('issuedBooks');
    }
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Search members
// @route   GET /api/members/search?query=val
exports.searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { memberId: { $regex: query, $options: 'i' } }
      ]
    };

    const members = await Member.find(searchQuery).populate('issuedBooks');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Add new member
// @route   POST /api/members
exports.addMember = async (req, res) => {
  try {
    const { memberId, name, department, contact } = req.body;

    if (!memberId || !name || !department || !contact) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingMember = await Member.findOne({ memberId });
    if (existingMember) {
      return res.status(400).json({ message: 'Member ID already exists' });
    }

    const member = await Member.create({
      memberId, name, department, contact
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
exports.updateMember = async (req, res) => {
  try {
    const { name, department, contact } = req.body;
    let updateData = { name, department, contact };
    
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if member has active issued books
    const activeIssues = await IssueRecord.countDocuments({
      memberId: member._id,
      status: 'issued'
    });

    if (activeIssues > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete member. Member has active issued books.' 
      });
    }

    // Optional: remove returned issue records, or keep them for history. Keeping for history is safer.
    await member.deleteOne();
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
