const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

/**
 * Message Schema for storing messages sent in a conversation room between users
 * Sender and receiver needs to be identified to distinguish sent and received messages
 */

const messageSchema = new Schema({
  room_id:      { type: ObjectId, ref: 'Room', required: true },
  sender_id:    { type: ObjectId, ref: 'User', required: true },
  receiver_id:  { type: ObjectId, ref: 'User', required: true },
  content:   { type: String,  required: true },
  timeSent:  { type: Date,    default: Date.now }
}, { timestamps: true });

module.exports = model('Message', messageSchema);