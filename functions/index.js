const functions = require('firebase-functions');
const app = require('express')();

const FBAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');

const { getAllPosts, createNewPost, getPost, commentOnPost, likePost, unlikePost, deletePost } = require('./handlers/posts');
const { signUp, login, uploadImage, addUserDetail, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');

//Post Routes
app.get('/posts', getAllPosts);
app.post('/post', FBAuth, createNewPost);
app.get('/post/:postId', getPost);
app.get('/post/:postId/like', FBAuth, likePost);
app.get('/post/:postId/unlike', FBAuth, unlikePost);
app.post('/post/:postId/comment', FBAuth, commentOnPost);
app.delete('/post/:postId', FBAuth, deletePost);

//User Routes
app.post('/signup', signUp);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetail);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);

//Creates notification document in firebase db for likes
exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/posts/${snapshot.data().postId}`).get()
      .then((doc) => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read:  false,
            type: 'like',
            postId: doc.id
          });
        };
      })
      .catch((err) => {
        console.error(err);
      });
  });

//Removes notification document in firebase db for likes
exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db.doc(`/notifications/${snapshot.id}`).delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

//Creates notification document in firebase db for comments
exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db.doc(`/posts/${snapshot.data().postId}`).get()
      .then((doc) => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read:  false,
            type: 'comment',
            postId: doc.id
          });
        };
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

//Changes user image for all posts
exports.onUserImageChange = functions.firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('Image has changed');
      const batch = db.batch();
      return db.collection('posts').where('userHandle', '==', change.before.data().handle).get()
        .then((data) => {
          data.forEach((doc) => {
            const post = db.doc(`/posts/${doc.id}`);
            batch.update(post, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    };
  });

//Delete everything related to post
exports.onPostDelete = functions.firestore.document('/posts/{postId}')
  .onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();
    return db.collection('comments').where('postId', '==', postId).get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return db.collection('likes').where('postId', '==',  postId).get()
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('notifications').where('postId', '==',  postId).get()
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
