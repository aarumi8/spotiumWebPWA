// middleware/auth.js

export default function({ store, redirect, route }) {
    const userIsLoggedIn = store.state.loggedIn;
    const userIsNew = store.state.newUser; // You can set this state after a user logs in for the first time.
  
    if (route.path === '/login' && userIsLoggedIn) {
      return redirect('/'); // if already logged in, redirect to home
    }
  
    if (route.path === '/create-profile' && !userIsNew) {
      return redirect('/'); // if not a new user, redirect to home
    }
  
    if (route.path !== '/login' && !userIsLoggedIn) {
      return redirect('/login'); // if not logged in, redirect to login
    }
  }
  