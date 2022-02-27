import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

// // queries
// const q = query(colRef, where('author', '==', 'patrick rothfuss'));

// queries - with order - title
// const q = query(
//   colRef,
//   where('author', '==', 'patrick rothfuss'),
//   orderBy('title', 'asc')
// );

// queries - with order - createdAt
const q = query(colRef, orderBy('createdAt'));

// get collection data - gets data once
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => console.log(err.message));

// real time collection data - listen to the data constantly
// onSnapshot(colRef, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// real time collection data - listen to the data constantly - with query
// onSnapshot(q, (snapshot) => {
//   let books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  })
    .then(() => addBookForm.reset())
    .catch((err) => console.log(err.message));
});

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', deleteBookForm.id.value);
  deleteDoc(docRef)
    .then(() => deleteBookForm.reset())
    .catch((err) => console.log(err.message));
});

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'updated title',
  })
    .then(() => {
      updateForm.reset();
    })
    .catch((err) => console.log(err));
});

// get a single document
const docRef = doc(db, 'books', 'JaZ7DyTeGoKOqlf9w1xE');

// getDoc(docRef)
//   .then((doc) => console.log(doc.data(), doc.id))
//   .catch((err) => console.log(err.message));

// onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id);
// });
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      console.log('user created: ', credentials.user);
      signupForm.reset();
    })
    .catch((err) => console.log(err.message));
});

// loggin in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => console.log('the user signed out'))
    .catch((err) => console.log(err.message));
});

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => console.log('user logged in: ', cred.user))
    .catch((err) => console.log(err.message));
});

// subscribing to auth changes
// onAuthStateChanged(auth, (user) => {
//   console.log('user status changed: ', user);
// });
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed: ', user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
});
