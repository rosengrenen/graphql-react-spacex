const express = require('express');
const {
  ApolloServer,
  gql
} = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql `
  type Query {
    hello(name: String): String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (_, {
      name
    }) => `Hello ${name || 'World'}`
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();
server.applyMiddleware({
  app,
  path: '/graphql'
});

app.listen({
    port: 4000
  }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);