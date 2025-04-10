import React, { useState, useEffect } from "react";
import "./home.css";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  newPostButton: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "50px",
    height: "50px",
    width: "50px",
    fontWeight: "bold",
    color: "white",
    position: "fixed",
    margin: "500px auto auto 1100px",
  },
});

const Home = () => {
  const myUsername = sessionStorage.getItem("username");
  const classes = useStyles();

  const [followeesId, setFolloweesId] = useState([]);
  const [users, setUsers] = useState({});
  const [followees, setFollowees] = useState([]);
  const [posts, setPosts] = useState({});

  //fetching the IDs of the followees, and fetching the list of all users
  useEffect(() => {
    const fetchFollowees = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?follower=${myUsername}&status=Accepted`
      );
      const data = await response.json();
      setFolloweesId(data.result.map((result) => result.followee));
    };
    const fetchUsers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?exactMatch=true`
      );
      const data = await response.json();
      setUsers(data);
    };
    fetchFollowees();
    fetchUsers();
  }, [myUsername]);

  //filtering out the followees from all users according to the IDs
  useEffect(() => {
    setFollowees(
      users.result?.filter((user) => followeesId.includes(user.userId))
    );
  }, [followeesId, users]);

  //fetching the tweets according to the list of followees
  useEffect(() => {
    const fetchTweets = async () => {
      const tweets = [];
      if (followees) {
        await Promise.all(
          followees?.map(async (followee) => {
            const response = await fetch(
              `http://${window.location.hostname}:3000/tweet/searchOtherTweet?lookForUsername=${followee.username}&myUsername=${myUsername}`
            );
            const data = await response.json();
            tweets.push(...data.result);
          })
        );
      }
      console.log(tweets);
      setPosts(tweets);
    };
    fetchTweets();
  }, [followees]);

  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={() => navigate("/CreateNewPost")}
        size="large"
        className={classes.newPostButton}
      >
        +
      </Button>

      <div className="card">
        {posts?.length === 0 && (
          <h2>
            You are not following anyone yet.
            <br />
            Start discovering interesting accounts to follow.
          </h2>
        )}
        {Array.isArray(posts) &&
          posts.map((post) => <Post key={post.tweetId} post={post} />)}
      </div>
    </div>
  );
};

export default Home;
