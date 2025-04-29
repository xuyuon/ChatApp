const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

/**
 * A Chat document references ALL messages in that conversation.
 * Because participants are not stored here, each message has "sender" & "receiver".
 */
const roomSchema = new Schema({
  users: [{ type: ObjectId, ref: "User", required: true }],
  message_id: [{ type: ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = model('Room', roomSchema);