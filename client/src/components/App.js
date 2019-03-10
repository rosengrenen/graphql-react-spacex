import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

import styles from './App.sass'

const Launch = ({ launch, image }) => {
  return (
    <div className={styles.launch} key={launch.flight_number} style={{ background: `url(${image.webformatURL})` }}>
      <div className={styles.missionName}>{launch.mission_name}</div>
      <div className={styles.rocketName}>{launch.rocket.rocket_name}</div>
    </div>
  )
}

const GET_LAUNCHES = gql`
  {
    launches {
      flight_number
      mission_name
      launch_year
      rocket {
        rocket_name
      }
    }
  }
`

const GET_IMAGES = gql`
  {
    images(query: "starry sky") {
      id
      webformatURL
    }
  }
`

const App = () => {
  return (
    <div className={styles.container}>
      <Query
        query={GET_LAUNCHES}>
        {({ loading: launchesLoading, error: launchesError, data: { launches } }) => (
          <Query
            query={GET_IMAGES}>
            {
              ({ loading: imagesLoading, error: imagesError, data: { images } }) => {
                if (launchesLoading || imagesLoading) return <p>Loading...</p>
                if (launchesError || imagesError) return <p>Error :(</p>
                console.log(images)
                return launches.map((launch, index) => {
                  console.log(images[index])
                  return (
                    <Launch launch={launch} image={images[index]} />
                  )
                }
                )
              }
            }
          </Query>
        )}
      </Query>
    </div>
  )
}

export default App
