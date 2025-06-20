require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const Schema = require('./GraphQl/schema'); // ✅ Import the GraphQL schema


const app = express();
const httpServer = http.createServer(app);

async function startApolloServer() {
    const server = new ApolloServer({
        schema: Schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start(); // ✅ MUST be awaited before using expressMiddleware
    app.use(cors());// ✅ JSON middleware
    app.use('/graphql', express.json(), expressMiddleware(server));


    connectDB();

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
    });
}

startApolloServer(); // ✅ Launch everything
