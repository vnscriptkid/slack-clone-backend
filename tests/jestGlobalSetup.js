import { startApolloServer } from "../app";

let server;

export default async () => {
  console.log("\nhello, this is just before tests start running");

  if (!server) {
    server = await startApolloServer();
  }
};
