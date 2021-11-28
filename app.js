import express from "express";
import http from "http";
import path from "path";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";

import models from "./models";
import { refreshTokens } from "./auth";

require("dotenv").config();

export async function startApolloServer() {
  const resolvers = mergeResolvers(
    loadFilesSync(path.join(__dirname, "./resolvers"))
  );

  const typeDefs = mergeTypeDefs(
    loadFilesSync(path.join(__dirname, "./schema"))
  );

  await models.sequelize.sync({ force: !!process.env.TEST_DB });

  const app = express();

  app.use(addUser);

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      return {
        models,
        user: req.user,
      };
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  const port = process.env.PORT || 4000;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );

  return server;
}

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(token, refreshToken, models);
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};
