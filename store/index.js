// store/index.js

export const state = () => ({
    loggedIn: false,
    newUser: true
  });
  
  export const mutations = {
    setLoggedIn(state, status) {
      state.loggedIn = status;
    },
    setNewUser(state, status) {
      state.newUser = status;
    }
  };
  