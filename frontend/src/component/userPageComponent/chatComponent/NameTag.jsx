import { CardHeader, Avatar } from "@mui/material";

// Receive username of string type, then fetch and return the profile picture URL of that user
const getPicUrl = (name) => {
  var returnUrl = "/"; //default return
  const fetchUrl = `http://${window.location.hostname}:5001/user/searchUser?username=${name}&exactMatch=true`;
  fetch(fetchUrl, { mode: "cors" })
    .then((res) => res.json()) // Retrieve user data from server response
    .then((data) => data.result.profilePic) // Retrieve only the profile picture URL from the user data
    .then((pic) => {
      console.log(`Profile pic of ${name} is "${pic}"`);
      returnUrl = pic ? pic : returnUrl;
    })
    .catch((err) => console.error(err.message));
  return returnUrl;
};

const NameTag = ({ name }) => {
  var picSrc = 'logo512.png'
  console.log("picSrc", picSrc);
  return (
    <CardHeader avatar={<Avatar alt={name} src={picSrc} />} title={name} />
  );
};

export default NameTag;
