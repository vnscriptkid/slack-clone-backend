import express from "express";
import { createServer } from "http";
import path from "path";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

import models from "./models";
import { refreshTokens } from "./auth";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { execute, subscribe } from "graphql";

require("dotenv").config();

export const pubsub = new PubSub();

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

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const subscriptionServer = SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // Pass a different path here if your ApolloServer serves at
      // a different path.
      path: "/subscriptions",
    }
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
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
