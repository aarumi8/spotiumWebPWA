// middleware/auth.js

export default function({ store, redirect, route }) {
    const userIsLoggedIn = store.state.loggedIn;
    const userIsNew = store.state.newUser;
    
    // if ((route.path === '/login' || route.path === '/login/') && userIsLoggedIn) {
    //   return redirect('/');
    // }
    
    // // If the user is on the create-profile page and they're not logged in
    // if (route.path === '/create-profile' && !userIsLoggedIn) {
    //   return redirect('/login');
    // }
  
    // If the user is on any other page (except /login and /create-profile) and they're not logged in
    // if (route.path === '/' && !userIsLoggedIn) {
    //   return redirect('/login');
    // }
  }
  