// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtVvPjdsj84mWqaG4-7SyjbljCnslZ1SM",
  authDomain: "hendaa-1.firebaseapp.com",
  databaseURL: "https://hendaa-1-default-rtdb.firebaseio.com",
  projectId: "hendaa-1",
  storageBucket: "hendaa-1.appspot.com",
  messagingSenderId: "831134776479",
  appId: "1:831134776479:web:56cd7098fc69cd70a376aa"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const submitInvestmentBtn = document.getElementById('submit-investment');
const investmentOptionSelect = document.getElementById('investment-option');
const incomeBalanceList = document.getElementById('income-balance-list');
const userBalanceElement = document.getElementById('user-balance-amount');

let userBalance = 0;

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('user-balance').style.display = 'block';
      document.getElementById('investment-form').style.display = 'block';
      document.getElementById('investment-balance').style.display = 'block';
      document.getElementById('income-balance-board').style.display = 'block';
      document.getElementById('investments-list').style.display = 'block';
      loadUserBalance();
      loadInvestments();
      loadInvestmentOptions();
    })
    .catch((error) => {
      console.error('Error logging in:', error);
    });
});

signupBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('user-balance').style.display = 'block';
      document.getElementById('investment-form').style.display = 'block';
      document.getElementById('investment-balance').style.display = 'block';
      document.getElementById('income-balance-board').style.display = 'block';
      document.getElementById('investments-list').style.display = 'block';
      loadUserBalance();
      loadInvestments();
      loadInvestmentOptions();
    })
    .catch((error) => {
      console.error('Error signing up:', error);
    });
});

submitInvestmentBtn.addEventListener('click', () => {
  const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
  if (userBalance < investmentAmount) {
    alert('Low balance! Please deposit more funds to continue.');
    return;
  }

  const investmentName = investmentOptionSelect.options[investmentOptionSelect.selectedIndex].text;
  const user = auth.currentUser;

  if (user) {
    db.collection('investments').add({
      userId: user.uid,
      name: investmentName,
      amount: investmentAmount
    })
    .then(() => {
      userBalance -= investmentAmount;
      userBalanceElement.textContent = userBalance.toFixed(2);
      loadInvestments();
    })
    .catch((error) => {
      console.error('Error adding investment:', error);
    });
  }
});

function loadUserBalance() {
  const user = auth.currentUser;
  if (user) {
    db.collection('users').doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          userBalance = doc.data().balance || 0;
          userBalanceElement.textContent = userBalance.toFixed(2);
        }
      })
      .catch((error) => {
        console.error('Error getting user balance:', error);
      });
  }
}

function loadInvestments() {
  const user = auth.currentUser;
  if (user) {
    db.collection('investments').where('userId', '==', user.uid).get()
      .then((querySnapshot) => {
        const investmentsList = document.getElementById('investment-list');
        const balanceAmount = document.getElementById('balance-amount');
        investmentsList.innerHTML = '';
        incomeBalanceList.innerHTML = '';
        let totalBalance = 0;

        querySnapshot.forEach((doc) => {
          const investment = doc.data();
          const li = document.createElement('li');
          li.textContent = `${investment.name}: $${investment.amount}`;
          investmentsList.appendChild(li);
          totalBalance += investment.amount;

          const incomeLi = document.createElement('li');
          incomeLi.textContent = `${investment.name}: $${investment.amount}`;
          incomeBalanceList.appendChild(incomeLi);
        });

        balanceAmount.textContent = totalBalance.toFixed(2);
      })
      .catch((error) => {
        console.error('Error getting investments:', error);
      });
  }
}

function loadInvestmentOptions() {
  // Example investment options
  const options = [
    { value: 'stocks', text: 'Stocks' },
    { value: 'bonds', text: 'Bonds' },
    { value: 'real-estate', text: 'Real Estate' }
  ];

  investmentOptionSelect.innerHTML = '<option value="">