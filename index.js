import express from "express";
import http from "http";
import path from "path";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { ApolloServer } from "apollo-server-express";

import models from "./models";

const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, "./resolvers"))
);

const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, "./schema")));

async function startApolloServer(typeDefs, resolvers) {
  await models.sequelize.sync({ force: true });

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers);
