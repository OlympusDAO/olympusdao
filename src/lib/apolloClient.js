import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
<<<<<<< HEAD
<<<<<<< HEAD
import { THE_GRAPH_URL } from "../constants";

<<<<<<< HEAD
<<<<<<< HEAD
const client = new ApolloClient({
  uri: THE_GRAPH_URL,
=======
import { THE_GRAPH_ID } from "../constants";

const APIRUL = "https://api.thegraph.com/subgraphs/id/" + THE_GRAPH_ID;

const client = new ApolloClient({
  uri: APIRUL,
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
import { THE_GRAPH_URL } from "../constants";

const client = new ApolloClient({
  uri: THE_GRAPH_URL,
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
  cache: new InMemoryCache(),
=======

const client = new ApolloClient({
	uri: THE_GRAPH_URL,
	cache: new InMemoryCache()
>>>>>>> Connect subgraph by name
=======
const client = new ApolloClient({
  uri: THE_GRAPH_URL,
  cache: new InMemoryCache(),
>>>>>>> updated to ohmCirculatingSupply
});

const apollo = queryString => {
  return client
    .query({
      query: gql(queryString),
    })
    .then(data => {
      return data;
    })
<<<<<<< HEAD
<<<<<<< HEAD
    .catch(err => console.error("qraph ql error: ", err));
=======
    .catch(err => console.log("qraph ql error: ", err));
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
    .catch(err => console.log("qraph ql error: ", err));
=======
    .catch(err => console.error("qraph ql error: ", err));
>>>>>>> updated to ohmCirculatingSupply
>>>>>>> updated to ohmCirculatingSupply
};

export default apollo;
