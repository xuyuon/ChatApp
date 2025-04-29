import Friend from '../models/friend.model.js';
import FriendRequest from '../models/friendrequest.model.js';
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js'; // if needed

/* ─────────────── R 2.1 – send request ─────────────── */
export const sendRequest = async (req, res) => {
  try {
    const fromUser = req.user._id;
    const { toUsername } = req.body;

    if (!toUsername)
      return res.status(400).json({ msg: 'toUsername required' });

    const toUser = await User.findOne({ username: toUsername });

    if (!toUser)
      return res.status(404).json({ msg: 'User not found' });

    if (fromUser.equals(toUser._id))
      return res.status(400).json({ msg: 'Cannot add yourself' });

    const alreadyFriend = await Friend.findOne({ user: fromUser, friend: toUser._id });
    if (alreadyFriend)
      return res.status(409).json({ msg: 'Already friends' });

    const pending = await FriendRequest.findOne({
      $or: [
        { fromUser,        toUser: toUser._id, status: 'pending' },
        { fromUser: toUser._id, toUser: fromUser, status: 'pending' }
      ]
    });
    if (pending)
      return res.status(409).json({ msg: 'Request already pending' });

    const request = await FriendRequest.create({ fromUser, toUser: toUser._id });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
  
  /* ─────────────── R 2.2 – accept ─────────────── */
  export const acceptRequest = async (req, res) => {
    try {
      const { reqId } = req.params;
      const fr = await FriendRequest.findById(reqId);
      if (!fr) return res.status(404).json({ msg: 'Request not found' });
  
      if (!fr.toUser.equals(req.user._id)) return res.status(403).json({ msg: 'Not your request' });
      if (fr.status !== 'pending')         return res.status(409).json({ msg: 'Already processed' });
  
      fr.status = 'accepted';
      await fr.save();
  
      const chat = await Chat.create({});          // empty messages array
      await Friend.create([
        { user: fr.fromUser, friend: fr.toUser, chat: chat._id },
        { user: fr.toUser,   friend: fr.fromUser, chat: chat._id }
      ]);
  
      res.json(fr);
    } catch (e) {
      res.status(500).json({ msg: e.message });
    }
  };
  
  /* ─────────────── R 2.2 – reject ─────────────── */
  export const rejectRequest = async (req, res) => {
    try {
      const { reqId } = req.params;
      const fr = await FriendRequest.findById(reqId);
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
  
  /* ─────────────── R 2.3 – unfriend ─────────────── */
  export const deleteFriend = async (req, res) => {
    try {
      const { username } = req.params; 
      const meId = req.user._id;
  
      /* look up the target user */
      const target = await User.findOne({ username }); 
      if (!target)
        return res.status(404).json({ msg: 'User not found' });
  
      /* make sure an edge exists (me ➞ target) */
      const edge = await Friend.findOne({ user: meId, friend: target._id });
      if (!edge)
        return res.status(404).json({ msg: 'You are not friends' });
  
      const chatId = edge.chat; 
  
      /* delete both directions */
      await Friend.deleteMany({
        $or: [
          { user: meId,       friend: target._id },
          { user: target._id, friend: meId }
        ]
      });

      /* delete the chat no matter it's empty or not */
      const chat = await Chat.findById(chatId);
      if (chat) {
        await Chat.findByIdAndDelete(chatId);
      }
  
      res.json({ msg: 'Friend removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: err.message });
    }
  };
  
  /* ─────────────── Convenience GETs ─────────────── */
  export const getFriends = async (req, res) => {
    const list = await Friend.find({ user: req.user._id })
                  .populate('friend', 'username');
    res.json(list);
  };
  
  export const getIncomingRequests = async (req, res) => {
    const inc = await FriendRequest.find({ toUser: req.user._id, status: 'pending' })
                  .populate('fromUser', 'username');
    res.json(inc);
  };
  
  export const getOutgoingRequests = async (req, res) => {
    const out = await FriendRequest.find({ fromUser: req.user._id, status: 'pending' })
                  .populate('toUser', 'username');
    res.json(out);
  };