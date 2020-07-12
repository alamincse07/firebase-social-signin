// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    console.log('user logged in: ', user);
    setupUI(user);
  } else {
    console.log('user logged out');
    setupUI();
  }
})

const updateForm = document.querySelector('#update-form');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bio = updateForm['update-bio'].value;

//    auth.currentUser.updateProfile({
//        bio: bio
//    }).then(function() {
//        // Update successful.
        console.log(auth.currentUser);
        var user = auth.currentUser;
        user.providerData[0].bio = bio
        database.ref('users/' + user.uid).update(user.providerData[0]);
        const modal = document.querySelector('#modal-update');
        M.Modal.getInstance(modal).close();
        updateForm.reset();
//        });

});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  const name = signupForm['signup-name'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password)
  .then(function(user) {
    // [END createwithemail]
    // callSomeFunction(); Optional
    auth.currentUser.updateProfile({
        displayName: name
    }).then(function() {
        // Update successful.
        console.log(auth.currentUser);
        var user = auth.currentUser;
        writeUserData(user);
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    }, function(error) {
        // An error happened.
        console.log(error)
    });
}, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    alert(errorMessage);
    // [END_EXCLUDE]
});
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset for
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});

function facebookSignin() {
    var provider = new firebase.auth.FacebookAuthProvider();
   //firebase.auth().signInWithPopup(provider)
   provider.setCustomParameters({
                  'auth_type': 'reauthenticate',
                   'display': 'popup'

            });

   auth.signInWithPopup(provider).then(function(result) {

      var token = result.credential.accessToken;
      var user = result.user;
      console.log("token "+token);
      console.log(user);
      writeUserData(user);
      const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
   }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
   });
}

function googleSignin() {
var provider = new firebase.auth.GoogleAuthProvider();
     provider.setCustomParameters({
                    'display': 'popup',
                    'prompt': 'select_account'

                });
   auth.signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log("token "+token);
      console.log(user);
      writeUserData(user);
      const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
    signupForm.reset();
   }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(error.code);
      console.log(error.message);
   });
}
//var ui = new firebaseui.auth.AuthUI(firebase.auth());
function firebasUiShow(){

  ui.start('#firebaseui-auth-container-1', {

    'callbacks': {
        signInSuccessWithAuthResult: function(currentUser, credential, redirectUrl) {
            var user = currentUser.providerData;
              console.log(currentUser);
              // writeUserData(user[0]);
            return false;
        },
        uiShown: function() {

        }
      },
      'signInFlow': 'popup',
    'signInOptions': [ // List of OAuth providers supported.
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false
        },

        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters:{
            'prompt': 'select_account'
          }
        },

         {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: [
            'public_profile',
            'email',
            'user_likes',
            'user_friends'
          ],
          customParameters: {
            // Forces password re-entry.
            'auth_type': 'reauthenticate',
            'display': 'popup',

          }

    }]
    });
ui.disableAutoSignIn();

    const modal = document.querySelector('#modal-login-ui');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
//ui.reset();
}

function writeUserData(user) {
        database.ref('users/' + user.uid).set(user.providerData[0]);
        }

function readUserData() {
    var ref = database.ref('/users/' + auth.currentUser.uid).once('value').then(function (snapshot) {
         userData(snapshot.val());
        console.log(snapshot.val());
    });
}