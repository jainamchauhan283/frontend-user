import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";


const HomePage: React.FC = () => {

  return (
    <>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <Typography variant="h5">All Users</Typography>
        </Toolbar>
      </AppBar>
     
    </>
  );
};

export default HomePage;
