import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
// will retrieve the token from localStorage and include it in every request to the API
// essentially creating a middleware function that will retrieve the token for us and combine it with the existing httpLink
import { setContext } from '@apollo/client/link/context'
// BrowserRouter, Routes and Route are components that the React Router library provides
// BrowserRouter is being renamed as Router in this case
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Nav from './components/Nav';
import { StoreProvider } from './utils/GlobalState';
import OrderHistory from './pages/OrderHistory';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          {/* All components between the StoreProvider are considered children of the StoreProvider
          This is possible because we included ...props in the StoreProvider definition */}
          <StoreProvider>
            <Nav />
            <Routes>
              <Route path='/' element={<Home></Home>}></Route>
              {/* <Route exact path="/" component={Home} /> */}
              <Route path='login' element={<Login></Login>}></Route>
              {/* <Route exact path="/login" component={Login} /> */}
              <Route path='/signup' element={<Signup></Signup>}></Route>
              {/* <Route exact path="/signup" component={Signup} /> */}
              <Route path='/orderHistory' element={<OrderHistory></OrderHistory>}></Route>
              {/* <Route exact path="/orderHistory" component={OrderHistory} /> */}
              <Route path='/products/:id' element={<Detail></Detail>}></Route>
              {/* <Route exact path="/products/:id" component={Detail} /> */}
              <Route path='*' element={<NoMatch></NoMatch>}></Route>
              {/* <Route component={NoMatch} /> */}
            </Routes>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
