// src/component/userPageComponent/FriendPage.jsx
import { useEffect, useState } from "react";
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
  useMediaQuery,

} from "@mui/material";
import PeopleIcon       from "@mui/icons-material/People";
import PersonAddIcon    from "@mui/icons-material/PersonAdd";
import CheckIcon        from "@mui/icons-material/Check";
import DeleteIcon        from "@mui/icons-material/Delete";
import ClearIcon       from "@mui/icons-material/Clear";
import MailOutlineIcon  from "@mui/icons-material/MailOutline";


const sidebarText = "hsl(36, 92.10%, 50.40%)"; // color of text in sidebar
/* ---------- helper row ---------- */
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
  /* state ------------------------------ */
  const [tab, setTab] = useState(0);      // 0: Friends | 1: Requests
  const [friends, setFriends]   = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [userNameInput, setuserNameInput] = useState("");

  const isSmallWindow = useMediaQuery("(max-width:1000px)");
  

  /* fetch ------------------------------ */
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

  /* actions ---------------------------- */
  const accept = id => axiosInstance.patch(`/friends/request/${id}/accept`).then(refresh);
  const reject = id => axiosInstance.patch(`/friends/request/${id}/reject`).then(refresh);
  const send   = () => {
    if (!userNameInput.trim()) return;
    axiosInstance.post('/friends/request', { toUsername: userNameInput.trim() })
      .then(()=>{ setuserNameInput(""); refresh(); });
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

  /* ui --------------------------------- */
  if (loading) {
    return (
      <Box sx={{ ml: '300px', mt: 8, display:"flex", justifyContent:"center" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display:"flex", flexDirection:"column" }}>
      <Box sx={{ my: "20px", mx: isSmallWindow ? "0px" : "150px", p: 3 }} backgroundColor="background.default">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"          // let us style manually
          TabIndicatorProps={{
            sx: { backgroundColor: sidebarText }
          }}
          sx={{
            /* label color when NOT selected */
            '.MuiTab-root': { color: sidebarText, opacity: 0.7 },
            /* label color when selected */
            '.Mui-selected': { color: sidebarText, opacity: 1 },
          }}>
          <Tab icon={<PeopleIcon />}  iconPosition="start"  label="Friends"  />
          <Tab icon={<PersonAddIcon />} iconPosition="start" label="Requests" />
        </Tabs>

        {/* ------- Friends Panel ------- */}
        {tab === 0 && (
          <Card elevation={3}>
            <CardHeader
              avatar={<PeopleIcon color="primary" />}
              title="My Friends"
            />
            <CardContent sx={{ pt:0 }}>
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
                        onClick={() =>
                          window.location.assign(`/chat?user=${f.friend._id}`)
                        }
                      >
                        <MailOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove friend">
                      <IconButton size="small" color="error" onClick={() => cancel(f.friend.username)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip></Box>
                  }
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* ------- Requests Panel ------- */}
        {tab === 1 && (
          <Box>
            {/* ---- add new request ---- */}
            <Card elevation={3} sx={{ mb:3 }}>
              <CardHeader
                avatar={<PersonAddIcon color="primary" />}
                title="Send a Friend Request"
              />
              <CardContent sx={{ pt:0 }}>
                <Box sx={{ display:"flex", gap:1 }}>
                  <TextField
                    label="User Name"
                    size="small"
                    fullWidth
                    value={userNameInput}
                    onChange={e=>setuserNameInput(e.target.value)}
                  />
                  <Button variant="contained" onClick={send}>Send</Button>
                </Box>
              </CardContent>
            </Card>

            {/* ---- incoming ---- */}
            <Card elevation={3} sx={{ mb:3 }}>
              <CardHeader
                avatar={<PersonAddIcon color="warning" />}
                title="Incoming Requests"
              />
              <CardContent sx={{ pt:0 }}>
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
              </CardContent>
            </Card>

            {/* ---- outgoing ---- */}
            <Card elevation={3}>
              <CardHeader
                avatar={<PersonAddIcon color="disabled" />}
                title="Requests You Sent"
              />
              <CardContent sx={{ pt:0 }}>
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
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );
}
