import React from 'react';
import './App.css';
import { AppContextProvider } from "./AppContext"
import axios, { AxiosResponse } from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { SearchBar } from "./components/SearchBar"
import { GitCards } from './GitCards';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  searchBar: {
    background: "#3C1874",
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  cardGrid: {
    background: "white"
  },

}));

export const App = () => {
  const classes = useStyles();
  


  return (
  <AppContextProvider >
    <CssBaseline />
      <Grid container>
        <Grid item xs={12} className={classes.searchBar}>
        <SearchBar />
        </Grid>
        <Grid item className={classes.cardGrid}>
        <GitCards />
        </Grid>
      </Grid>
  </AppContextProvider>
  );
}



