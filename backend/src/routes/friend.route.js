// Routes for friend requests and friends
const express = require('express');
const { protect } = require('../middleware/protect.js');
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  deleteFriend,
  getFriends,
  getIncomingRequests,
  getOutgoingRequests
} = require('../controllers/friend.controller.js');

const router = express.Router();
router.use(protect);

/* R 2.1: Sending Friend Request */
router.post('/request', sendRequest);

/* R 2.2: Accepting/Rejecting Friend Request */
router.patch('/request/:reqId/accept', acceptRequest);
router.patch('/request/:reqId/reject', rejectRequest);

/* R 2.3: Deleting Friend */
router.delete('/:username', deleteFriend);

/* GETs for frontend */
router.get('/', getFriends);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/outgoing', getOutgoingRequests);

module.exports = router;