import React, {useState, MouseEvent, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { CardHeader, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import axios, { AxiosResponse } from 'axios';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles( (theme) => ({ 
    root: {
        maxWidth: 345,
        borderRadius: 0,
        margin: "10px",
        background: "#F3F3F3"
    },
    viewed: {
      background: "#909090",
      color: "#3C1874"
    },
    updated: {
      border: "solid 5px #48F542"
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
      },
      expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      avatar: {
        background: "red",
      },
}));

const GitCard = (data: any) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isFav, setIsFav] = useState(false)
  const [isViewed, setIsViewed] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)

  const fetchRedisData = async () => {
    try {
      const headers = {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : '*',
          }
      const res : AxiosResponse = await axios({
        method: "get",
        url: `http://localhost:3000/api/repos?key=${data.data.id}`,
        headers 
      })
      if (res && res.data){
        
        setIsFav(res.data.isFav)
        if(res.data.isViewed){
          setIsViewed(true)
        }
        if (data.data.updated_at !== res.data.lastUpdated){
          setIsUpdated(true)
        }
      }
    } catch (error) {
      
    }
  }

  const updateRedis = async (favStatus : boolean, viewStatus: boolean) => {
    try {
      const headers = {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin" : '*',
          }
      const res : AxiosResponse = await axios({
        method: "post",
        url: `http://localhost:3000/api/repos`,
        headers,
        data: {
          "key": data.data.id,
          "value": {
            "isFav" : favStatus,
            "isViewed": viewStatus,
            "lastUpdated" : data.data.updated_at,
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setIsViewed(true);
    setIsUpdated(false);
    updateRedis(isFav, true)
  };

  const handleFavsClick = (event: MouseEvent<HTMLButtonElement>) => {
    updateRedis(!isFav, isViewed)
    setIsFav(!isFav)
  }

  useEffect(() => {
    fetchRedisData()
  // empty array to only load once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Card className={`${classes.root} ${isUpdated ? classes.updated : ""} ${isViewed ? classes.viewed : ""}  `}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} src={data.data.owner.avatar_url} />
        }
        title={data.data.name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
        Last Updated: {data.data.updated_at}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"
          onClick={handleFavsClick}
        >
          <FavoriteIcon color={isFav ? "primary" : "inherit"} />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        <Typography variant="h6">
        Description
          </Typography>
          <Typography paragraph>
            {data.data.description}
          </Typography>

        </CardContent>
      </Collapse>
    </Card>
  )

}

export { GitCard }