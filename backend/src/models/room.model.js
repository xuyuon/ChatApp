const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

/**
 * A Room Schema references saving messages in that conversation (room), between users
 * Created when user accept the friend request, such that the user can select the chat room with the new friend
 */
const roomSchema = new Schema({
  users: [{ type: ObjectId, ref: "User", required: true }],
  message_id: [{ type: ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = model('Room', roomSchema);