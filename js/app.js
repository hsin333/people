// Firebase 設定
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 取得資料庫參考
const database = firebase.database();
const messagesRef = database.ref('messages');

// DOM 元素
const messageInput = document.getElementById('messageInput');
const nameInput = document.getElementById('nameInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

// 發送訊息
function sendMessage() {
    const message = messageInput.value.trim();
    const name = nameInput.value.trim() || '匿名';
    
    if (message) {
        messagesRef.push({
            name: name,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        messageInput.value = '';
    }
}

// 監聽發送按鈕
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 接收訊息
messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement('div');
    const currentName = nameInput.value.trim() || '匿名';
    const messageClass = message.name === currentName ? 'sent' : 'received';
    
    const time = new Date(message.timestamp);
    const timeString = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
    
    messageElement.className = `message ${messageClass}`;
    messageElement.innerHTML = `
        <div class="sender">${message.name}</div>
        <div class="text">${message.text}</div>
        <div class="time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});