// store/index.js

export const state = () => ({
    loggedIn: false,
    newUser: true,
    avatarUrl: null,
    isHeadingPermission: false,
    isBusiness: false,
    quests: []
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
    },
    addQuest(state, quest) {  // Add a new quest to the quests array
      state.quests.push({
        name: quest.name,
        link: quest.link,
        location: quest.location
      });
    }
  };
  