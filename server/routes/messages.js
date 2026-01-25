const express = require('express');
const mongoose = require('mongoose');
const { auth } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const House = require('../models/House');

const router = express.Router();

router.post('/start', auth, async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property id' });
    }

    const property = await House.findById(propertyId).select('owner');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const ownerId = property.owner.toString();
    const currentUserId = req.user._id.toString();

    if (ownerId === currentUserId) {
      return res.status(400).json({ message: 'You cannot start a conversation with yourself for your own property.' });
    }

    const participants = [ownerId, currentUserId];

    let conversation = await Conversation.findOne({
      property: propertyId,
      participants: { $all: participants },
    });

    if (!conversation) {
      conversation = new Conversation({
        property: propertyId,
        participants,
        messages: [],
      });
      await conversation.save();
    }

    const populated = await Conversation.findById(conversation._id)
      .populate('property', 'title location.city')
      .populate('participants', 'name email userType');

    return res.json({ conversation: populated });
  } catch (error) {
    console.error('Start conversation error:', error);
    return res.status(500).json({ message: 'Server error while starting conversation' });
  }
});

// Get unread conversation count for notification badge
router.get('/unread-count', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).select('lastMessage readBy');

    const userId = req.user._id.toString();
    let unreadCount = 0;

    conversations.forEach((conv) => {
      const lm = conv.lastMessage;
      if (!lm || !lm.sender) return;

      // Ignore messages sent by the current user
      if (lm.sender.toString() === userId) return;

      const readEntry = (conv.readBy || []).find(
        (r) => r.user && r.user.toString() === userId
      );
      const lastSeen = readEntry?.lastSeenAt;

      if (!lastSeen || (lm.createdAt && lm.createdAt > lastSeen)) {
        unreadCount += 1;
      }
    });

    return res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({ message: 'Server error while fetching unread count' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const rawConversations = await Conversation.find({
      participants: req.user._id,
    })
      .sort({ updatedAt: -1 })
      .populate('property', 'title location.city')
      .populate('participants', 'name email userType')
      .select('-messages');

    const userId = req.user._id.toString();

    const conversations = rawConversations.map((conv) => {
      const convObj = conv.toObject();
      const lm = convObj.lastMessage;
      let isUnread = false;

      if (lm && lm.sender && lm.sender.toString() !== userId) {
        const readEntry = (convObj.readBy || []).find(
          (r) => r.user && r.user.toString() === userId
        );
        const lastSeen = readEntry?.lastSeenAt;

        if (!lastSeen || (lm.createdAt && new Date(lm.createdAt) > new Date(lastSeen))) {
          isUnread = true;
        }
      }

      convObj.isUnread = isUnread;
      return convObj;
    });

    return res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ message: 'Server error while fetching conversations' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    let conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied to this conversation' });
    }

    // Mark this conversation as read for the current user
    const userId = req.user._id.toString();
    const now = new Date();

    const existingEntry = (conversation.readBy || []).find(
      (r) => r.user && r.user.toString() === userId
    );

    if (existingEntry) {
      existingEntry.lastSeenAt = now;
    } else {
      conversation.readBy.push({ user: req.user._id, lastSeenAt: now });
    }

    await conversation.save();

    const populated = await Conversation.findById(req.params.id)
      .populate('property', 'title location.city')
      .populate('participants', 'name email userType')
      .populate('messages.sender', 'name');

    return res.json({ conversation: populated });
  } catch (error) {
    console.error('Get conversation error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid conversation id' });
    }
    return res.status(500).json({ message: 'Server error while fetching conversation' });
  }
});

router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied to this conversation' });
    }

    const now = new Date();
    const message = {
      sender: req.user._id,
      text: text.trim(),
    };

    conversation.messages.push(message);
    conversation.lastMessage = {
      text: message.text,
      sender: message.sender,
      createdAt: now,
    };

    // Mark as read for the sender
    const userId = req.user._id.toString();
    const existingEntry = (conversation.readBy || []).find(
      (r) => r.user && r.user.toString() === userId
    );

    if (existingEntry) {
      existingEntry.lastSeenAt = now;
    } else {
      conversation.readBy.push({ user: req.user._id, lastSeenAt: now });
    }

    await conversation.save();

    const populated = await Conversation.findById(conversation._id)
      .populate('property', 'title location.city')
      .populate('participants', 'name email userType')
      .populate('messages.sender', 'name');

    return res.status(201).json({ conversation: populated });
  } catch (error) {
    console.error('Send message error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid conversation id' });
    }
    return res.status(500).json({ message: 'Server error while sending message' });
  }
});

// Mark all messages as seen for the current user (used when opening the Messages page)
router.post('/mark-seen', auth, async (req, res) => {
  try {
    req.user.lastMessagesSeenAt = new Date();
    await req.user.save();
    return res.json({ success: true, lastMessagesSeenAt: req.user.lastMessagesSeenAt });
  } catch (error) {
    console.error('Mark messages seen error:', error);
    return res.status(500).json({ message: 'Server error while marking messages as seen' });
  }
});

module.exports = router;
