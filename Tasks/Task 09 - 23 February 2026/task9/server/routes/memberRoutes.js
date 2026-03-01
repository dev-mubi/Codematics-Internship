const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMemberById,
  searchMembers,
  addMember,
  updateMember,
  deleteMember
} = require('../controllers/memberController');

router.get('/search', searchMembers);
router.route('/')
  .get(getMembers)
  .post(addMember);

router.route('/:id')
  .get(getMemberById)
  .put(updateMember)
  .delete(deleteMember);

module.exports = router;
