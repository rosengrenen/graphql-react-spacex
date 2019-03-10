const express = require('express');
const {
  ApolloServer,
  gql
} = require('apollo-server-express');
const axios = require('axios');
const bodyParser = require('body-parser');

// Construct a schema, using GraphQL schema language
const typeDefs = gql `
  type Launch {
    flight_number: ID
    mission_name: String,
    launch_year: String,
    launch_date_local: String,
    launch_success: Boolean,
    rocket: Rocket
  }

  type Rocket {
    rocket_id: String,
    rocket_name: String,
    rocket_type: String
  }

  type Query {
    launches: [Launch],
    launch(flight_number: ID): Launch,
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    launches: (_, {}) => {
      return axios.get('https://api.spacexdata.com/v3/launches').then(result => result.data);
    },
    launch: (_, {
      flight_number
    }) => {
      return axios.get(`https://api.spacexdata.com/v3/launches/${flight_number}`).then(result => result.data);
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

server.applyMiddleware({
  app,
  path: '/graphql'
});

app.listen({
    port: 4000
  }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);