import mongoose from 'mongoose';
const { Schema, model, Types: { ObjectId } } = mongoose;

const friendRequestSchema = new Schema({
  from_user_id: { type: ObjectId, ref: 'User', required: true },
  to_user_id:   { type: ObjectId, ref: 'User', required: true },
  status:   { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  date_send: { type: Date, default: Date.now }
}, { timestamps: true });

export default model('FriendRequest', friendRequestSchema);