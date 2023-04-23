// external imports
const createError = require('http-errors');

// internal imports
const Conversation = require('../models/Conversation');
const escape = require('../utilities/escape');
const User = require('../models/People');
const Message = require('../models/Message');

// inbox page, all conversations of the logged in user
const getInbox = async function (req, res, next) {
  try {
    const conversation = await Conversation.find({
      $or: [
        { 'creator.id': req.user.userid },
        { 'participant.id': req.user.userid },
      ],
    });

    res.locals.data = conversation || [];
    res.render('inbox');
  } catch (err) {
    next(err);
  }
};

// search user for new conversation
const searchUser = async function (req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace('+88', '');

  const nameSearchRegEx = new RegExp(escape(searchQuery), 'i');
  const mobileSearchRegEx = new RegExp('^' + escape('+88' + searchQuery));
  const emailSearchRegEx = new RegExp('^' + escape(searchQuery) + '$', 'i');

  try {
    if (!searchQuery) {
      throw createError('You must provide some text to search!');
    }

    const users = await User.find(
      {
        $or: [
          { name: nameSearchRegEx },
          { mobile: mobileSearchRegEx },
          { email: emailSearchRegEx },
        ],
      },
      'name avatar'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

// create conversation with a new user
const createConversation = async function (req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: 'Conversation was added successfully!',
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const getMessages = async function (req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort('-createdAt');

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: 'Unknown error occured!',
        },
      },
    });
  }
};


// send new message
const sendMessage = async function (req, res, next) {
    if (req.body.message || (req.files && req.files.length > 0)) {
      try {
        // save message text/attachment in database
        let attachments = null;
  
        if (req.files && req.files.length > 0) {
          attachments = [];
  
          req.files.forEach(file => {
            attachments.push(file.filename);
          });
        }
  
        const newMessage = new Message({
          text: req.body.message,
          attachment: attachments,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          receiver: {
            id: req.body.receiverId,
            name: req.body.receiverName,
            avatar: req.body.avatar || null,
          },
          conversation_id: req.body.conversationId,
        });
  
        const result = await newMessage.save();
  
        // emit socket event
        global.io.emit('new_message', {
          message: {
            conversation_id: req.body.conversationId,
            sender: {
              id: req.user.userid,
              name: req.user.username,
              avatar: req.user.avatar || null,
            },
            message: req.body.message,
            attachment: attachments,
            date_time: result.date_time,
          },
        });
  
        res.status(200).json({
          message: 'Successful!',
          data: result,
        });
      } catch (err) {
        res.status(500).json({
          errors: {
            common: {
              msg: err.message,
            },
          },
        });
      }
    } else {
      res.status(500).json({
        errors: {
          common: 'message text or attachment is required!',
        },
      });
    }
  }
  

module.exports = { getInbox, searchUser, createConversation, getMessages, sendMessage };
