import mongoose from 'mongoose';
const { Schema, model, Types: { ObjectId } } = mongoose;

/**
 * A Chat document references ALL messages in that conversation.
 * Because participants are not stored here, each message has "sender" & "receiver".
 */
const chatSchema = new Schema({
  message_id: [{ type: ObjectId, ref: 'Message' }]
}, { timestamps: true });

export default model('Chat', chatSchema);