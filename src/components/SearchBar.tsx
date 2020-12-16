import React, { useState, useEffect, ChangeEvent } from "react"
import axios, { AxiosResponse } from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {Button } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { useAppDispatch} from "../AppContext"
import { useDebounce } from "../useDebounce"


const useStyles = makeStyles( (theme) => ({
    search: {
        position: 'sticky',
        top: 0,
        backgroundColor: "white",
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
        margin: "15px",
        justifyContent: "space-evenly"
      },
      searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
        width: "90%",
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
      },
      clearButton: {
        background: "red",
        borderRadius: "0px",
      }
}));

const SearchBar = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch()
    const [query, setQuery] = useState("")
    const debouncedSearchTerm = useDebounce(query, 500)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      setQuery(event.currentTarget.value)
    }

    const fetchRepos = async () => {
      
        try {
          const res : AxiosResponse = await axios({
            method: "get",
            url: "https://api.github.com/search/repositories?q=" + query
          })

          dispatch({
            type: "updateRepoData",
            value: res.data
          })
        } catch (error) {
          console.log(error)
        }      
    }

    const clearData = async () => {
      try {
        const headers = {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin" : '*',
            }
        const res : AxiosResponse = await axios({
          method: "get",
          url: `http://localhost:3000/api/clearall`,
          headers 
        })
        window.location.reload(false);
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      // use debounce to limit github api calls
      if (debouncedSearchTerm){
        fetchRepos();
      }
    }, [debouncedSearchTerm])

   return (
     <>
   <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder="Search…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ 'aria-label': 'search' }}
      onChange={handleChange}
    />
  </div>
  <Button className={classes.clearButton} onClick={clearData}>Clear All Data</Button>
  </>
  );
      
}

export { SearchBar }