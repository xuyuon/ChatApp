/*
Home page component
This component is the home page of the application. It displays a welcome message and notifications for friend requests.
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CircularProgress from '@mui/material/CircularProgress';
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Grid, Button, Box, Card, CardHeader, CardContent, Typography } from "@mui/material";

import { styles } from "../../styling/userPage.styling";
import { axiosInstance } from "../../lib/axios";
import { getUserName } from "../../lib/checkAuth";


const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [incoming, setIncoming] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const name = await getUserName();
        if (name) {
          setUsername(name);
        } else {
          console.error("Failed to fetch username");
        }
        const incomingResponse = await axiosInstance.get("/friends/requests/incoming")
        if (incomingResponse.status === 200) {
          setIncoming(incomingResponse.data);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsername();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      >
        <CircularProgress size={80} />
      </Box>
    );
  }


  console.log("HomePage username:", username);


  return (
    <Box>
      <Card sx={styles.card}>
        <CardHeader
          avatar={<HomeIcon sx={styles.icon} />}
          title={`Welcome back`}
          sx={styles.cardHeader}
        />
        <CardContent>
          <Box sx={styles.cardContentContainer}>
            <Typography variant="h7">Hello, {username}! </Typography>
            <Typography variant="h7">Get started by talking to a friend! </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={styles.card}>
        <CardHeader
          avatar={<NotificationsIcon sx={styles.icon} />}
          title={`Notifications`}
          sx={styles.cardHeader}
        />
        <CardContent>
          <Box sx={styles.cardContentContainer}>
            <Typography variant="h7" sx={{fontSize: "1.2rem"}}>Friend Requests</Typography>
            {incoming.length === 0 && (
              <Typography variant="h7">
                You have no friend requests.
              </Typography>
            )}
            {incoming.length > 0 && (
              <Button 
                variant="text" 
                sx={styles.notificationButton}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/userPage/friends");
                }}
              >
                You have {incoming.length} new friend request(s).
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
};

export default HomePage;
