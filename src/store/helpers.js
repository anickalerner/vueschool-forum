import firebase from 'firebase'

function postsFBRef () {
  return firebase.firestore().collection('posts').doc()
}
function postFBRef (id) {
  return firebase.firestore().collection('posts').doc(id)
}
function userFBRef (id) {
  return firebase.firestore().collection('users').doc(id)
}
function forumFBRef (id) {
  return firebase.firestore().collection('forums').doc(id)
}
function threadFBRef (id) {
  return firebase.firestore().collection('threads').doc(id)
}
function threadsFBRef () {
  return firebase.firestore().collection('threads').doc()
}

export {
  postFBRef,
  postsFBRef,
  userFBRef,
  forumFBRef,
  threadFBRef,
  threadsFBRef
}
