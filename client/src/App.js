import Header from "./components/Header";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Clients from "./components/client";


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});


const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache,
});

function App() {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <Header />
        <div className="container">
          <Clients />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
