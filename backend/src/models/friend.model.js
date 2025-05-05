// data model for friends data
const mongoose = require('mongoose');
const { Schema, model, Types: { ObjectId } } = mongoose;

const friendSchema = new Schema({
    user:   { type: ObjectId, ref: 'User', required: true },
    friend: { type: ObjectId, ref: 'User', required: true },
    room:   { type: ObjectId, ref: 'Room', required: true },
    date_added: { type: Date, default: Date.now }
  });

module.exports = model('Friend', friendSchema);