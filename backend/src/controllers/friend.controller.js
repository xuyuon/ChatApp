// Controller for friends system requirements
const Friend = require('../models/friend.model.js');
const FriendRequest = require('../models/friendrequest.model.js');
const Room = require('../models/room.model.js');
const User = require('../models/user.model.js');

/* R 2.1: Sending Friend Request */
const sendRequest = async (req, res) => {
  try {
    const fromUser = req.user._id;
    const { toUsername } = req.body;

    // check if the user input of username is valid
    if (!toUsername)
      return res.status(400).json({message: 'toUsername required' });

    const toUser = await User.findOne({ username: toUsername });

    if (!toUser)
      return res.status(404).json({message: 'User not found' });

    // prevent sending request issues
    if (fromUser.equals(toUser._id))
      return res.status(401).json({message: 'Cannot add yourself' });

    const alreadyFriend = await Friend.findOne({ user: fromUser, friend: toUser._id });
    if (alreadyFriend)
      return res.status(409).json({message: 'Already friends' });

    const pending = await FriendRequest.findOne({
      $or: [
        { fromUser,        toUser: toUser._id, status: 'pending' },
        { fromUser: toUser._id, toUser: fromUser, status: 'pending' }
      ]
    });
    if (pending)
      return res.status(409).json({message: 'Request already pending' });

    // send request
    const request = await FriendRequest.create({ fromUser, toUser: toUser._id });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: err.message });
  }
};
  
  /* R 2.2: Accepting/Rejecting Friend Request */
const acceptRequest = async (req, res) => {
  try {
    const { reqId } = req.params;
    const fr = await FriendRequest.findById(reqId);

    // prevent accepting issues
    if (!fr) return res.status(404).json({ msg: 'Request not found' });
    if (!fr.toUser.equals(req.user._id)) return res.status(403).json({ msg: 'Not your request' });
    if (fr.status !== 'pending')         return res.status(409).json({ msg: 'Already processed' });

    fr.status = 'accepted';
    await fr.save();

    const room = await Room.create({ users: [fr.fromUser, fr.toUser] });    // empty messages array
    await Friend.create([
      { user: fr.fromUser, friend: fr.toUser, room: room._id },
      { user: fr.toUser,   friend: fr.fromUser, room: room._id }
    ]);

    res.json(fr);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};
  
const rejectRequest = async (req, res) => {
  try {
    const { reqId } = req.params;
    const fr = await FriendRequest.findById(reqId);

    // prevent accepting issues
    if (!fr) return res.status(404).json({ msg: 'Request not found' });
    if (!fr.toUser.equals(req.user._id)) return res.status(403).json({ msg: 'Not your request' });
    if (fr.status !== 'pending')         return res.status(409).json({ msg: 'Already processed' });

    fr.status = 'rejected';
    await fr.save();
    res.json(fr);
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};
  
  /* R 2.3: Deleting Friend */
const deleteFriend = async (req, res) => {
  try {
    const { username } = req.params; 
    const meId = req.user._id;

    // look up the target user
    const target = await User.findOne({ username }); 
    if (!target)
      return res.status(404).json({ msg: 'User not found' });

    // make sure friend relationship exists
    const edge = await Friend.findOne({ user: meId, friend: target._id });
    if (!edge)
      return res.status(404).json({ msg: 'You are not friends' });

    const roomId = edge.room; 

    // delete friendship for both users
    await Friend.deleteMany({
      $or: [
        { user: meId,       friend: target._id },
        { user: target._id, friend: meId }
      ]
    });

    // delete the chat
    const room = await Room.findById(roomId);
    if (room) {
      await Room.findByIdAndDelete(roomId);
    }

    res.json({ msg: 'Friend removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
  
  /* GETs for frontend */
const getFriends = async (req, res) => {
  const list = await Friend.find({ user: req.user._id })
                .populate('friend', 'username');
  res.json(list);
};
  
const getIncomingRequests = async (req, res) => {
  const inc = await FriendRequest.find({ toUser: req.user._id, status: 'pending' })
                .populate('fromUser', 'username');
  res.json(inc);
};
  
const getOutgoingRequests = async (req, res) => {
  const out = await FriendRequest.find({ fromUser: req.user._id, status: 'pending' })
                .populate('toUser', 'username');
  res.json(out);
};

module.exports = {
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests
};