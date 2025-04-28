import mongoose from 'mongoose';
const { Schema, model, Types: { ObjectId } } = mongoose;

const friendRequestSchema = new Schema({
  fromUser: { type: ObjectId, ref: 'User', required: true },
  toUser:   { type: ObjectId, ref: 'User', required: true },
  status:   { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default model('FriendRequest', friendRequestSchema);