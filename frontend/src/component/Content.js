import React from "react";
import { Grid } from "@mui/material";
import Login from "./Login";

function Content({ setLogInAs }) {
  return (
    <div>
        <Grid item xs={12} sm={8}>
          <Login setLogInAs={setLogInAs} />
        </Grid>
    </div>
  );
}

export default Content;
