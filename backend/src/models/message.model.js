const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

const messageSchema = new Schema({
  chat_id:      { type: ObjectId, ref: 'Chat', required: true },
  sender_id:    { type: ObjectId, ref: 'User', required: true },
  receiver_id:  { type: ObjectId, ref: 'User', required: true },
  content:   { type: String,  required: true },
  timeSent:  { type: Date,    default: Date.now }
}, { timestamps: true });

module.exports = model('Message', messageSchema);