const primary = "hsl(36, 92.10%, 50.40%)";
const secondary = "hsl(36, 92.10%, 40%)";
const background = "hsl(33, 91.80%, 90.40%)"; // Light background color
const backgroundDark = "hsl(33, 91.80%, 80%)"; // Darker background color

export const styles = {
  card: {
    margin: "20px",
    padding: "20px",
  },
  cardHeader: {
    ".MuiCardHeader-title": {
      color: primary,
      fontSize: "1.2rem", // Set the title color and size
    },
  },
  icon: {
    color: primary,
    fontSize: "1.2rem", // Match the title font size
  },
  textField: {
    maxWidth: "800px", // Limit the width to half of the viewport width
  },
  button: {
    backgroundColor: primary,
    color: "white",
    fontSize: "0.9rem", // Adjust the font size of the button text
    padding: "0 20px", // Adjust padding for better spacing
    "&:hover": {
      backgroundColor: secondary, // Darken the color on hover
    },
    width: "100px", // Set a fixed width for the button
    minHeight: "30px", // Set a minimum height for the button
    marginX: "10px",
  },
  cardContentContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginBottom: "30px",
  },
  inputContainer: {
    display: "flex",
    gap: 1,
  },
  notificationButton: {
    maxWidth: "800px", 
    color: "black",
    fontSize: "0.9rem",
    backgroundColor: background,
    "&:hover": {
      backgroundColor: backgroundDark,
    },
  }
};

export default styles;