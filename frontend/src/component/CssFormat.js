import { makeStyles } from "@mui/styles";

export const UseStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FFD6BA",
  },
  rootNormal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "white",
  },
  formContainer: {
    display: "flex",
    borderStyle: "solid",
    borderColor: "black",
    flexDirection: "column",
    padding: theme.spacing(5),
    backgroundColor: "white",
  },
  form: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    marginTop: theme.spacing(4),
  },
  form_title: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "0 0 20px 0",
    fontWeight: "bold",
  },
  formDescription: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 50px 20px 50px",
    backgroundColor: "white",
  },
  form_item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "start",
    padding: "20px 0 20px 0",
  },
  form_redirect: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    padding: "30px 0 10px 0",
  },
  form_button_grp: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px 0 10px 0",
  },
  linkText: {
    color: "black",
    textDecoration: "none",
    fontWeight: "bold",
  },
  submitButton: {
    margin: theme.spacing(2, 0),
  },
  button: {
    textTransform: "none",
    backgroundColor: "#F47458",
    borderRadius: "25px",
    height: "46px",
    width: "146px",
    fontWeight: "bold",
    color: "white",
  },
  loginTitle: {
    padding: "0 0 20px 0",
    justifyContent: "start",
    alignItems: "flex-start",
  },
  loginDesc: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "30px 0 20px 0",
    justifyContent: "start",
  },
  inputField: {
    backgroundColor: "#FFF6F4",
  },
}));