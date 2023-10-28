// store/index.js

export const state = () => ({
    loggedIn: false,
    newUser: true,
    avatarUrl: null,
    isHeadingPermission: false,
    isBusiness: false,
    avatarLink: "https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb?quality=high",
    quests: [
      // {
      //   name: "d",
      //   link: "https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb",
      //   location: {lon: 27.561063, lat: 53.917392 } 
      // }
    ]
  });
  
  export const mutations = {
    setAvatarLink(state, status) {
      state.avatarLink = status
    },
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
    setBusiness(state, status) {
      state.isBusiness = status
    },
    addQuest(state, quest) {  // Add a new quest to the quests array
      state.quests.push({
        name: quest.name,
        link: quest.link,
        location: quest.location
      });
    }
  };
  