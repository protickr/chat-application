// external imports
const express = require('express');

// internal imports
const {
  getInbox,
  searchUser,
  createConversation,
  getMessages,
  sendMessage,
} = require('../controllers/inboxController');
const {
  decorateHtmlResponse,
} = require('../middlewares/common/decorateHtmlResponse');
const { checkLogin } = require('../middlewares/common/checkLogin');
const attachmentUpload = require('../middlewares/inbox/attachmentUpload');

const router = express.Router();

router.get('/', decorateHtmlResponse('Inbox'), checkLogin, getInbox);

// search user - this should be in user router ?
router.post('/search', checkLogin, searchUser);

// create conversation
router.post('/conversation', checkLogin, createConversation);

// load messages of a conversation
router.get('/messages/:conversation_id', checkLogin, getMessages);

// send message
router.post('/message', checkLogin, attachmentUpload, sendMessage);

module.exports = router;
