const express = require('express');
const router = express.Router();
const {
  getIssues,
  getIssuesByMember,
  issueBook,
  returnBook
} = require('../controllers/issueController');

router.get('/', getIssues);
router.get('/member/:memberId', getIssuesByMember);
router.post('/issue', issueBook);
router.put('/return/:issueId', returnBook);

module.exports = router;
