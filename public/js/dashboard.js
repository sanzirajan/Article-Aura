import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6P-KX-hmWT1Ko-EHPTFuAr8D9pju3jJY",
  authDomain: "blog-website-c5a88.firebaseapp.com",
  projectId: "blog-website-c5a88",
  storageBucket: "blog-website-c5a88.appspot.com",
  messagingSenderId: "840715638159",
  appId: "1:840715638159:web:75f91e5da277a1fa2167fa"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const blogSection = document.querySelector('.blogs-section');
const loginUI = document.querySelector('#loginUI');
const login = document.querySelector('.login');

// Initialize FirebaseUI
const loadFirebaseUI = () => {
  return new Promise((resolve) => {
    if (window.firebaseui) {
      resolve(window.firebaseui);
    } else {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/firebasejs/ui/6.0.1/firebase-ui-auth.js';
      script.onload = () => resolve(window.firebaseui);
      document.head.appendChild(script);
    }
  });
};

// Setup login button and UI
const setupLoginButton = (ui) => {
  ui.start("#loginUI", {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectURL) {
        login.style.display = "none";
        getUserWrittenBlogs();
        return false; // Prevents redirect
      }
    },
    signInFlow: "popup",
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID
    ]
  });
};

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in, UID:", user.uid);
    login.style.display = "none";
    getUserWrittenBlogs();
  } else {
    console.log("No user is signed in");
    login.style.display = "block";
    loadFirebaseUI().then((firebaseui) => {
      const ui = new firebaseui.auth.AuthUI(auth);
      setupLoginButton(ui);
    });
  }
});

// Fetch user's blogs
const getUserWrittenBlogs = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user signed in");
    return;
  }

  const userEmail = user.email;
  const username = userEmail.split('@')[0];

  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("author", "==", username));
    const querySnapshot = await getDocs(q);
    
    blogSection.innerHTML = ''; // Clear existing content
    
    querySnapshot.forEach((doc) => {
      createBlogCard(doc);
    });

    if (querySnapshot.empty) {
      console.log("No blogs found for this user");
      blogSection.innerHTML = '<p>You haven\'t written any blogs yet.</p>';
    }
  } catch (error) {
    console.error("Error getting blogs:", error);
    blogSection.innerHTML = '<p>Error loading blogs. Please try again later.</p>';
  }
};

// Create blog card
const createBlogCard = (blog) => {
  let data = blog.data();
  const blogCard = document.createElement('div');
  blogCard.className = 'blog-card';
  blogCard.innerHTML = `
    <img src="${data.bannerImage}" class="blog-image" alt="">
    <h1 class="blog-title">${data.title.substring(0, 100) + '...'}</h1>
    <p class="blog-overview">${data.article.substring(0, 200) + '...'}</p>
    <a href="/blog?id=${blog.id}" class="btn dark">read</a>
    <a href="/editor?id=${blog.id}" class="btn grey">edit</a>
    <a href="#" onclick="deleteBlog('${blog.id}')" class="btn danger">delete</a>
  `;
  blogSection.appendChild(blogCard);
}

const deleteBlog = async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
    getUserWrittenBlogs(); // Refresh the blog list
  } catch (error) {
    console.error("Error deleting the blog:", error);
  }
};

// Make deleteBlog available globally
window.deleteBlog = deleteBlog;

// Initial call to set up the page
onAuthStateChanged(auth, (user) => {
  if (user) {
    login.style.display = "none";
    getUserWrittenBlogs();
  } else {
    login.style.display = "block";
    loadFirebaseUI().then((firebaseui) => {
      const ui = new firebaseui.auth.AuthUI(auth);
      setupLoginButton(ui);
    });
  }
});