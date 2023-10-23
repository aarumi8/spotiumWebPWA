// middleware/auth.js

export default function({ store, redirect, route }) {
    const userIsLoggedIn = store.state.loggedIn;
    const userIsNew = store.state.newUser;
  
    if (route.path === '/login' && userIsLoggedIn && !userIsNew) {
      return redirect('/'); // if already logged in and not a new user, redirect to home
    }
  
    if (route.path === '/create-profile' && !userIsLoggedIn) {
      return redirect('/login'); // if not logged in, redirect to login
    }
  
    if (route.path === '/create-profile' && !userIsNew) {
      return redirect('/'); // if already a new user, redirect to home
    }
  
    if (route.path !== '/login' && route.path !== '/create-profile' && !userIsLoggedIn) {
      return redirect('/login'); // if on any other page and not logged in, redirect to login
    }
  }
  