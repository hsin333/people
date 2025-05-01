// 初始化 GUN
const gun = Gun(['https://gun-manhattan.herokuapp.com/gun']);

// 建立聊天室資料參考
const chat = gun.get('chat');

// DOM 元素
const messageInput = document.getElementById('messageInput');
const nameInput = document.getElementById('nameInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');

// 儲存用戶名稱到 localStorage
if (localStorage.getItem('username')) {
    nameInput.value = localStorage.getItem('username');
}
nameInput.addEventListener('change', () => {
    localStorage.setItem('username', nameInput.value);
});

// 發送訊息
function sendMessage() {
    const message = messageInput.value.trim();
    const name = nameInput.value.trim() || '匿名';
    
    if (message) {
        chat.set({
            name: name,
            text: message,
            timestamp: Date.now()
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
chat.map().on(function(message, id) {
    if (!message || !message.timestamp) return; // 忽略無效訊息
    
    // 檢查訊息是否已經顯示過
    if (document.getElementById(id)) return;
    
    const messageElement = document.createElement('div');
    messageElement.id = id; // 設定唯一ID避免重複顯示
    
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
    
    // 將新訊息加入到聊天視窗
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});