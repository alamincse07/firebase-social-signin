const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const userData = (data)=>{
    let html = '';
    console.log(data);
    for (var key of Object.keys(data)) {
    console.log(key + " -> " + data[key]);

    const li = `
      <li>
        ${key} : ${data[key]}
      </li>
    `;
    html += li;
  }
  accountDetails.innerHTML = html;

};



const setupUI = (user) => {
  if (user) {
    // toggle user UI elements
     let html = '';
    //   <div>Logged in as ${user.email}</div>
    //   <div>Name: ${user.displayName}</div>
    // `;
    //accountDetails.innerHTML = html;
    for (var key of Object.keys(user.providerData[0])) {
    console.log(key + " -> " + user.providerData[0][key]);

    const li = `
      <li>
        ${key} : ${user.providerData[0][key]}
      </li>
    `;
    html += li;
  }
  accountDetails.innerHTML = html;
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // toggle user elements
    accountDetails.innerHTML = '';
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    googlePrompt();

  }
};
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  var instances = M.Modal.init(modals);

});

function googlePrompt(){

ui.start('#firebaseui-auth-container', {

                    'callbacks': {
                        signInSuccessWithAuthResult: function(currentUser, credential, redirectUrl) {
                           // if (credential.user) {
                           //   handleSignedInUser(credential.user);
                           // }
                            return false;
                        },
                        uiShown: function() {

                        }
                      },
                      'signInFlow': 'redirect',
                    'signInOptions': [ // List of OAuth providers supported.
                        {
                          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                          customParameters:{
                            'prompt': 'select_account'
                          },
                          authMethod: 'https://accounts.google.com',
                          clientId: CLIENT_ID

                        }

                    ],
                      'credentialHelper': CLIENT_ID ?
                        firebaseui.auth.CredentialHelper.GOOGLE_YOLO :
                        firebaseui.auth.CredentialHelper.None
                    });
    document.getElementById('firebaseui-auth-container').style.display = 'none';
    ui.disableAutoSignIn();
}
