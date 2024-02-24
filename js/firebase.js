// // Importing All Dependencies From FireBAse
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDa3J1CohOmy4pXtyDPALCRBsI94QA12W8",
  authDomain: "blog-app-hamza.firebaseapp.com",
  projectId: "blog-app-hamza",
  storageBucket: "blog-app-hamza.appspot.com",
  messagingSenderId: "870066224676",
  appId: "1:870066224676:web:ea89e9837ba8c1058ba2b1",
  measurementId: "G-4NH6755GMX",
};
// // Initializing Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
// // Getting NEccessory ID`s From html Pages
const logIn = document.getElementById("signin");
const signUp = document.getElementById("signup-btn");
const loginWithGoogleBtn = document.getElementById("loginWithGoogleBtn");
const logInWithGoogleBtn = document.getElementById("logInWithGoogleBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailText = document.getElementById("emailText");
const profile = document.getElementById("profile");

const onLoad = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    // Check if the user is on the sign-in page
    const isSignInPage = window.location.href.includes("sign_in.html");

    // Execute the logic only if the user is logged in and not on the sign-in page
    if (user && !isSignInPage) {
      emailText && (emailText.innerHTML = user.email || user.displayName);
      if (!user.photoURL) {
        profile && (profile.src = "./assets/images/profile-dummy.avif");
      } else {
        profile && (profile.src = user.photoURL);
      }
    } else if (!user && !isSignInPage) {
      // Redirect to the sign-in page if the user is not logged in and not on the sign-in page
      alert("SignIn First To Continue:");
      window.location.href = "sign_in.html";
    }
  });
};

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", onLoad);
const signUP = (event) => {
  event.preventDefault();
  const spinnerContainer = document.querySelector(".spinner-container");
  const uploadSpinner = document.getElementById("upload-spinner");
  spinnerContainer.classList.add("show");

  var email = document.getElementById("signup-email").value;
  var password = document.getElementById("signup-password").value;
  var username = document.getElementById("sign-up-username").value;

  createUserWithEmailAndPassword(auth, email, password, username)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      set(ref(database, "users/" + user.uid), {
        displayName: username,
        email: email,
      });
      // ...
      console.log(user);
      // Hide the spinner after successful
      spinnerContainer.classList.remove("show");
      alert("Signup Successfully!");
      document.getElementById("signup-form").reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..

      // Hide the spinner in case of an error
      const spinnerContainer = document.querySelector(".spinner-container");
      spinnerContainer.classList.remove("show");
      alert(errorMessage);
    });
};
// For sign in
const signIN = (event) => {
  event.preventDefault();
  const spinnerContainer = document.querySelector(".spinner-container");
  const uploadSpinner = document.getElementById("upload-spinner");
  spinnerContainer.classList.add("show");

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      // Signed in
      const user = userCredential.user;
      const dateTime = new Date();
      update(ref(database, "users/" + user.uid), {
        last_login: dateTime,
      });
      // ...

      // Hide the spinner after successful upload
      spinnerContainer.classList.remove("show");
      window.location.href = "./index.html";
      alert("Successfully Sign In");
      console.log(user.displayName);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      // Hide the spinner in case of an error
      const spinnerContainer = document.querySelector(".spinner-container");
      spinnerContainer.classList.remove("show");
    });
};
// For Google Login
const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Login Succesfully!");
      window.location.href = "./index.html";
    })
    .catch((error) => {
      alert(error);
    });
};
// For LogOut
const logOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      alert("Sign Out Succesfully");
      window.location.href = "sign_in.html";
    })
    .catch((error) => {
      // An error happened.
      alert("Something went wrong please try again!");
    });
};
// Add this function at the bottom of your script

document.addEventListener("DOMContentLoaded", function () {
  const switchSignin = document.querySelector(".switchSignin");
  const switchSignUp = document.querySelector(".switchSignup");
  const switchSigIn = () => {
    document.querySelector(".signin-form").classList.remove("d-none");
    document.querySelector(".signin-form").classList.add("d-block");
    document.querySelector(".signup-form").classList.add("d-none");
  };

  const switchSignup = () => {
    document.querySelector(".signup-form").classList.remove("d-none");
    document.querySelector(".signup-form").classList.add("d-block");
    document.querySelector(".signin-form").classList.add("d-none");
  };
  switchSignUp && switchSignUp.addEventListener("click", switchSignup);
  switchSignin && switchSignin.addEventListener("click", switchSigIn);
});
// //  Adding Event Listener To All Neccessory Functions
// upload && upload.addEventListener("click", addDataInFirestore);
loginWithGoogleBtn &&
  loginWithGoogleBtn.addEventListener("click", signInWithGoogle);
logInWithGoogleBtn &&
  logInWithGoogleBtn.addEventListener("click", signInWithGoogle);
logoutBtn && logoutBtn.addEventListener("click", logOut);
logIn && logIn.addEventListener("click", signIN);
signUp && signUp.addEventListener("click", signUP);
