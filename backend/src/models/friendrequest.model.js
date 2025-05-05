// data model for friend requests
const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

const friendRequestSchema = new Schema({
  fromUser: { type: ObjectId, ref: 'User', required: true },
  toUser:   { type: ObjectId, ref: 'User', required: true },
  status:   { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = model('FriendRequest', friendRequestSchema);