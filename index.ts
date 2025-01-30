import express from 'express';
import { app } from './app'; // Ensure this is your express app
import dbConnection from './src/db';
import { ApolloServer } from 'apollo-server-express';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

import movies from './src/models/movies';

const PORT = process.env.PORT || 8001;

// Database connection
dbConnection()
  .then(() => {
    console.log('DB connected');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(`Error while connecting to DB: ${error}`));

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './src/graphQL/typeDefs')));
const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './src/graphQL/resolvers')));

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ movies }),
});

// **The important change**: Await the server to start before applying middleware
async function startServer() {
  try {
    // Await server start
    await server.start();
    
    // Apply Apollo Server middleware to Express app after it has started
    server.applyMiddleware({ app, path: '/graphql' });
    
    console.log("Apollo Server started successfully!");
  } catch (error) {
    console.error(`Error while starting Apollo Server: ${error}`);
  }
}

// Call the function to start the Apollo server
startServer();
