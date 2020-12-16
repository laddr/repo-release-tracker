import React from "react"
import { Grid } from '@material-ui/core';
import { useAppContext } from "./AppContext"
import {GitCard} from "./components/GitCard"

const GitCards = () => {
    const context = useAppContext()
   
    return (
        <>
        {context?.repoData.hasOwnProperty("items") && context?.repoData.items.length > 0 &&  <Grid container>
          {context?.repoData.items.map((value, index) => (
            <Grid key={index} item xs={6} sm={3}>
              <GitCard data={value} />
            </Grid>
          ))}
        </Grid>}
      </>
    )
}

export { GitCards }