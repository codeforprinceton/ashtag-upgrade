import Vue from 'vue'
import Vuex from 'vuex'
//import firebase from 'firebase'
import { fireb } from '../plugins/firebase'

//import example from './module-example'

Vue.use(Vuex)

const initialState = {
  user: {}, // {displayName: 'Joel', email: 'joel@edu.org'},
  lastPOI: {}, // {lat: 40.34923, lng: -74.65955},
  profile: {},
  simplePoints: 10,
  tagPoints: 50,
  flagToSpamThreshold: 1,
  userTagList: {}
}

const state = Object.assign({}, initialState)

// const state = {
//   user: {},
//   lastPOI: {},
//   profile: {},
//   simplePoints: 10,
//   tagPoints: 50,
//   flagToSpamThreshold: 1,
//   userTagList: {}
// }

const mutations = {
  SET_USER (state, user) {
    state.user = user
    console.log("Mutation User: " + state.user.displayName)
  },
  SET_PROFILE (state, profile) {
    state.profile = profile
  },
  SET_TAGLIST (state, userTags) {
    state.userTags = userTags
  },
  SET_POI (state, poi) {
    state.lastPOI = poi
  },
  RESET_STATE (state) {
    for (let prop in state) {
      state[prop] = initialState[prop]
    }
  }
}

const actions = {
  setUser (context, user) {
    console.log("SetUser Action :" + user.displayName)
    context.commit('SET_USER', user)
    if (user) {
      fireb.database().ref('user_profiles').orderByChild('user_email')
        .equalTo(user.email)
        .once('value')
        .then(function (snapshot) {
          var value = snapshot.val()
          if (value) {
            context.commit('SET_PROFILE', value[user.uid])
          }
          else {
            // If first time login, create Profile in Firebase
            const p = { user_email: user.email, points: 0, user_name: user.displayName }
            fireb.database().ref('user_profiles').child(user.uid).set(p).then(context.commit('SET_PROFILE', p))
          }
        })
    }
  },
  setProfile (context, profile) {
    context.commit('SET_PROFILE', profile)
  },
  setTaglist (context, userTags) {
    context.commit('SET_TAGLIST', userTags)
  },
  // Point of Interest
  setLastPOI (context, poi) {
    context.commit('SET_POI', poi)
  },
  resetState (context) {
    context.commit('RESET_STATE', state)
  }
}

const getters = {
// getters for userName, userEmail, userPhoto, etc.
  getUser: (state) => { return state.user },
  getProfile: (state) => { return state.profile }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
