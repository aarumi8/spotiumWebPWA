// store/index.js

export const state = () => ({
    loggedIn: false,
    newUser: true,
    avatarUrl: null,
    isHeadingPermission: false
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
    },
    setIsHeadingPermission(state, status) {
      state.isHeadingPermission = status;
    }
  };
  