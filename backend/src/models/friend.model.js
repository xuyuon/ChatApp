import mongoose from 'mongoose';
const { Schema, model, Types: { ObjectId } } = mongoose;

const friendSchema = new Schema({
    user_id:   { type: ObjectId, ref: 'User', required: true },
    friend_id: { type: ObjectId, ref: 'User', required: true },
    chat_id:   { type: ObjectId, ref: 'Chat', required: true },
    date_added: { type: Date, default: Date.now }
  });

export default model('Friend', friendSchema);