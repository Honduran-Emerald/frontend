import firebase from 'firebase/app'

// cloud message push cert BDn22gcaJp9cqpBwzE5RXSpmDOFg_YzqNiOeBilmLi1uPt48fFLXnBC5nRD9zJparZb5_At-njq7X01e4PVdQ_A

const firebaseConfig = {
  apiKey: "AIzaSyA5hcQYAQCq2gsMM6_LhYRpt6-eA9WaKaM",
  authDomain: "honduran-emerald.firebaseapp.com",
  projectId: "honduran-emerald",
  storageBucket: "honduran-emerald.appspot.com",
  messagingSenderId: "785617149003",
  appId: "1:785617149003:web:814471e1d8cef8087001ce",
  measurementId: "G-50HWXY45EB"
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging();

messaging.onBackgroundMessage((message) => {
  console.log('Got background message', JSON.stringify(message))
})

messaging.onMessage((message) => {
  console.log('Got regular message', JSON.stringify(message))
})