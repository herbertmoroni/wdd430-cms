var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact'); // Add this import

// GET /messages - Get all messages with sender names
router.get('/', async (req, res, next) => {
  try {
    // Get all messages
    const messages = await Message.find();

    // For each message, look up the sender's name
    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        const contact = await Contact.findOne({ id: message.sender });
        return {
          id: message.id,
          subject: message.subject,
          msgText: message.msgText,
          sender: message.sender,
          senderName: contact ? contact.name : `User ${message.sender}`
        };
      })
    );

    res.status(200).json({
      message: 'Messages fetched successfully!',
      messages: populatedMessages
    });
  } catch (error) {
    console.log('Error fetching messages:', error);
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});

// POST /messages - Add new message
router.post('/', async (req, res, next) => {
  try {
    const maxMessageId = sequenceGenerator.nextId("messages");

    const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
    });

    const createdMessage = await message.save();

    // Look up the sender's contact info
    const contact = await Contact.findOne({ id: createdMessage.sender });

    // Return the message with sender name populated
    const messageWithSenderName = {
      id: createdMessage.id,
      subject: createdMessage.subject,
      msgText: createdMessage.msgText,
      sender: createdMessage.sender,
      senderName: contact ? contact.name : `User ${createdMessage.sender}`
    };

    res.status(201).json({
      message: 'Message added successfully',
      messageData: messageWithSenderName
    });
  } catch (error) {
    console.log('Error saving message:', error);
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});

// PUT /messages/:id - Update existing message
router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      Message.updateOne({ id: req.params.id }, message)
        .then(result => {
          res.status(204).json({
            message: 'Message updated successfully'
          })
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found'}
      });
    });
});

// DELETE /messages/:id - Delete message
router.delete("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      Message.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Message deleted successfully"
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found'}
      });
    });
});

module.exports = router;
