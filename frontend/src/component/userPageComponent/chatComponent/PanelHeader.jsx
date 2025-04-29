import React from "react";
import { Card, Grid } from "@mui/material";
import NameTag from "./NameTag";

const PanelHeader = ({ sender }) => {
  return (
    <Card square style={{ minHeight: "10%" }}>
      <Grid container justifyContent="center" alignItems="center">
        <NameTag name={sender} />
      </Grid>
    </Card>
  );
};

export default PanelHeader;