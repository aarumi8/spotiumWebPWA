// store/index.js

export const state = () => ({
    loggedIn: false,
    newUser: true,
    avatarUrl: null
  });
  
  export const mutations = {
    setAvatarUrl(state, status) {
      state.avatarUrl = status
    },
    setLoggedIn(state, status) {
      state.loggedIn = status;
    },
    setNewUser(state, status) {
      state.newUser = status;
    }
  };
  