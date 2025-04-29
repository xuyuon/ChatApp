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

/* R 2.1 */
router.post('/request', sendRequest);

/* R 2.2 */
router.patch('/request/:reqId/accept', acceptRequest);
router.patch('/request/:reqId/reject', rejectRequest);

/* R 2.3 */
router.delete('/:username', deleteFriend);

/* Convenience GETs */
router.get('/', getFriends);
router.get('/requests/incoming', getIncomingRequests);
router.get('/requests/outgoing', getOutgoingRequests);

module.exports = router;