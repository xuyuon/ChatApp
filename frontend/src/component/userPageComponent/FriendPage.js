// Frontend of friend system
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance }   from "../../lib/axios";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Button,
  TextField,
  Tooltip,
} from "@mui/material";
import { toast } from "react-hot-toast";
import PeopleIcon       from "@mui/icons-material/People";
import PersonAddIcon    from "@mui/icons-material/PersonAdd";
import CheckIcon        from "@mui/icons-material/Check";
import DeleteIcon        from "@mui/icons-material/Delete";
import ClearIcon       from "@mui/icons-material/Clear";
import MailOutlineIcon  from "@mui/icons-material/MailOutline";
import SendIcon from '@mui/icons-material/Send';


import { styles } from "../../styling/userPage.styling";


const sidebarText = "hsl(36, 92.10%, 50.40%)"; // color of text in sidebar
// Row template for display of friends
const Row = ({ name, right }) => (
  <Box
    sx={{
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      py:0.8
    }}
  >
    <Box sx={{ display:"flex", alignItems:"center" }}>
      <Avatar sx={{ width:32, height:32, mr:1 }}>
        {name[0].toUpperCase()}
      </Avatar>
      <Typography>{name}</Typography>
    </Box>
    {right}
  </Box>
);

export default function FriendPage() {
  const [tab, setTab] = useState(0);      // 0: Friends | 1: Requests
  const [friends, setFriends]   = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [userNameInput, setuserNameInput] = useState("");
  const navigate = useNavigate();
  

  /* fetch friends and friend request status when loading the page */
  const refresh = async () => {
    try {
      const [
        { data: f },
        { data: inc },
        { data: out },
      ] = await Promise.all([
        axiosInstance.get("/friends"),
        axiosInstance.get("/friends/requests/incoming"),
        axiosInstance.get("/friends/requests/outgoing"),
      ]);
      setFriends(f);
      setIncoming(inc);
      setOutgoing(out);
    } finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);

  // functions for requirements
  const accept = id => axiosInstance.patch(`/friends/request/${id}/accept`).then(refresh);
  const reject = id => axiosInstance.patch(`/friends/request/${id}/reject`).then(refresh);
  const send   = () => {
    if (!userNameInput.trim()) return;  // trim to prevent empty space
    axiosInstance.post('/friends/request', { toUsername: userNameInput.trim() })
      .then(()=>{ setuserNameInput(""); refresh(); })
      .catch(err => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };
  const cancel = (name) => {
    if (!name.trim()) return
    if (!window.confirm(`Deleting friend : ${name.trim()} \nIt will also delete your chat history. Continue to delete?`)) {
      return;
    }
    axiosInstance.delete(`/friends/${name.trim()}`)
    .then(refresh)
    .catch(err => console.error(err));
  };
  //navigate to chat page
  const startChat = (username) => {
    navigate('/userPage/chat', { state: { recipient: username } });
  };

  // loading sign
  if (loading) {
    return (
      <Box sx={{ mt: 8, display:"flex", justifyContent:"center" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display:"flex", flexDirection:"column" }}>
      <Box sx={{ my: "20px", mx: "0px", p: 3 }} backgroundColor="background.default">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"
          TabIndicatorProps={{
            sx: { backgroundColor: sidebarText } // color of indicator
          }}
          sx={{
            // label color when not selected
            '.MuiTab-root': { color: sidebarText, opacity: 0.7 },
            // label color when selected
            '.Mui-selected': { color: sidebarText, opacity: 1 },
          }}>
          <Tab icon={<PeopleIcon />}  iconPosition="start"  label="Friends"  />
          <Tab icon={<PersonAddIcon />} iconPosition="start" label="Requests" />
        </Tabs>

        {/* Friends list and actions */}
        {tab === 0 && (
          <Card elevation={3 } sx={styles.card}>
            <CardHeader
              avatar={<PeopleIcon sx={styles.icon} />}
              title="My Friends"
              sx={styles.cardHeader}
            />
            <CardContent sx={{ pt:0 }}>
              <Box sx={styles.cardContentContainer}>
                {friends.length === 0 && (
                  <Typography color="text.secondary" align="center">
                    You have no friends yet
                  </Typography>
                )}
                {friends.map(f => (
                  <Row
                    key={f._id}
                    name={f.friend.username}
                    right={
                      <Box>
                      <Tooltip title="Start chat">
                        <IconButton
                          size="small"
                          onClick={() => startChat(f.friend.username)} // chat button
                        >
                          <MailOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove friend">
                        {/* delete friend button */}
                        <IconButton size="small" color="error" onClick={() => cancel(f.friend.username)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip></Box>
                    }
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Requests Panel */}
        {tab === 1 && (
          <Box>
            {/* R 2.1: add new request */}
            <Card elevation={3} sx={styles.card}>
              <CardHeader
                avatar={<SendIcon sx={styles.icon} />}
                title="Add Friend"
                sx={styles.cardHeader}
              />
              <CardContent>
                <Box sx={styles.cardContentContainer}>
                  <Typography variant="h7">Please fill in your friend's username:</Typography>
                  <Box sx={styles.inputContainer}>
                    <TextField
                      label="User Name"
                      size="small"
                      fullWidth
                      sx={styles.textField}
                      value={userNameInput}
                      onChange={e=>setuserNameInput(e.target.value)}
                    />
                    <Button variant="contained" sx={styles.button} onClick={send}>
                      Send
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* incoming requests */}
            <Card elevation={3} sx={styles.card}>
              <CardHeader
                avatar={<PersonAddIcon sx={styles.icon} />}
                title="Incoming Requests"
                sx={styles.cardHeader}
              />
              <CardContent>
                <Box sx={styles.cardContentContainer}>
                  {incoming.length === 0 && (
                    <Typography color="text.secondary" align="center">
                      None
                    </Typography>
                  )}
                  {incoming.map(r => (
                    <Row
                      key={r._id}
                      name={r.fromUser.username}
                      right={
                        <>
                          <IconButton size="small" color="success" onClick={()=>accept(r._id)}>
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={()=>reject(r._id)}>
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </>
                      }
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* pending requests */}
            <Card elevation={3} sx={styles.card}>
              <CardHeader
                avatar={<MailOutlineIcon sx={styles.icon} />}
                title="Requests You Sent"
                sx={styles.cardHeader}
              />
              <CardContent>
                <Box sx={styles.cardContentContainer}>
                  {outgoing.length === 0 && (
                    <Typography color="text.secondary" align="center">
                      None
                    </Typography>
                  )}
                  {outgoing.map(r => (
                    <Row
                      key={r._id}
                      name={r.toUser.username}
                      right={
                        <Typography variant="caption" color="text.secondary">
                          Pending
                        </Typography>
                      }
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
