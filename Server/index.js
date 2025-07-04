require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // ✅ Required for verifying JWT
const connectDB = require("./config/db");
const typeDefs = require("./GraphQl/schema");
const resolvers = require("./GraphQl/resolver");

const app = express();
const httpServer = http.createServer(app);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Middleware for JSON parsing and attaching context with user info
  app.use(cors());
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        if (authHeader) {
          try {
            // Remove "Bearer " prefix if present
            const token = authHeader.split(' ')[1];
            // console.log("eee",authHeader)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // decoded = { id, email, role }
            return { user: decoded };
          } catch (err) {
            console.error("Invalid or expired token:", err.message);
            return { user: null };
          }
        }
        return { user: null };
      },
    })
  );

  // Connect to MongoDB
  connectDB();

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
