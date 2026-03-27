// script.js

document.addEventListener('DOMContentLoaded', () => {

    const chatbotContainer = document.getElementById('chatbot-container');
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeButton = document.getElementById('close-button');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = chatForm.querySelector('button[type="submit"]');

    // --- Persistence helpers ---
    const STORAGE_KEY = 'chatbot_messages_v1';
    const STORAGE_OPEN_KEY = 'chatbot_open_v1';
    let isRestoringMessages = false;

    function saveMessagesToStorage() {
        const messages = Array.from(chatMessages.children).map(el => ({
            text: el.textContent,
            sender: el.classList.contains('user-message') ? 'user' : 'bot'
        }));
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch (_) {}
    }

    function restoreMessagesFromStorage() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const messages = JSON.parse(raw);
            chatMessages.innerHTML = '';
            isRestoringMessages = true;
            messages.forEach(m => displayMessage(m.text, m.sender));
            isRestoringMessages = false;
        } catch (_) {}
    }

    // Track whether the user explicitly closed the chat
    let userExplicitlyClosed = false;

    // Centralized helpers to open/close chat reliably
    function openChatWindow() {
        userExplicitlyClosed = false;
        chatWindow.classList.remove('hidden');
        chatBubble.classList.add('hidden');
        chatBubble.style.display = 'none';
        chatbotContainer.classList.add('open');
        try { sessionStorage.setItem(STORAGE_OPEN_KEY, '1'); } catch (_) {}
    }

    function closeChatWindow() {
        userExplicitlyClosed = true;
        chatWindow.classList.add('hidden');
        chatBubble.classList.remove('hidden');
        chatBubble.style.display = '';
        chatbotContainer.classList.remove('open');
        try { sessionStorage.setItem(STORAGE_OPEN_KEY, '0'); } catch (_) {}
    }

    // Guard against any unexpected code adding 'hidden' to the chat window
    const observer = new MutationObserver(() => {
        const isWindowHidden = chatWindow.classList.contains('hidden');
        const isBubbleVisible = getComputedStyle(chatBubble).display !== 'none';

        if (isWindowHidden && !userExplicitlyClosed) {
            // Reopen if it was not a deliberate close
            openChatWindow();
        }

        // If window is open, ensure bubble stays hidden
        if (!isWindowHidden && isBubbleVisible) {
            chatBubble.classList.add('hidden');
            chatbotContainer.classList.add('open');
        }
    });

    observer.observe(chatbotContainer, { attributes: true, subtree: true, attributeFilter: ['class', 'style'] });

    // --- Event Listeners ---
    chatBubble.addEventListener('click', () => {
        openChatWindow();
    });

    closeButton.addEventListener('click', () => {
        closeChatWindow();
    });

    // This handles the form submission
    chatForm.addEventListener('submit', (event) => {
        // THIS IS THE FIX: It prevents the page from reloading
        event.preventDefault();
        event.stopPropagation();
        openChatWindow();

        const userMessage = chatInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            sendMessageToAPI(userMessage);
            chatInput.value = '';
            saveMessagesToStorage();
        }
    });

    // Prevent clicks inside the chat window/form from bubbling up
    chatWindow.addEventListener('click', (e) => e.stopPropagation());
    chatForm.addEventListener('click', (e) => e.stopPropagation());
    if (sendButton) {
        sendButton.addEventListener('click', (e) => {
            e.stopPropagation();
            openChatWindow();
        });
    }

    // Redundant periodic safeguard to keep window open only if it should be open
    setInterval(() => {
        const shouldBeOpen = (sessionStorage.getItem(STORAGE_OPEN_KEY) === '1');
        if (!userExplicitlyClosed && shouldBeOpen) {
            openChatWindow();
            saveMessagesToStorage();
        }
    }, 800);

    // --- Helper Functions ---
    function displayMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        
        // THIS IS THE FIX: Use a timeout to ensure scrolling happens after the DOM updates.
        // This prevents the chat from scrolling to the top on its own.
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 0);

        // Ensure the window stays open whenever a new message is displayed
        if (!isRestoringMessages) {
            openChatWindow();
        }
    }

    async function sendMessageToAPI(message) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            displayMessage(data.answer, 'bot');

        } catch (error) {
            console.error('Error sending message to API:', error);
            displayMessage('Sorry, something went wrong. Please try again.', 'bot');
        } finally {
            // Save the conversation history after the bot responds or an error occurs.
            saveMessagesToStorage();
        }
    }

    // Rehydrate on load. Start closed by default until the user opens it.
    try { if (!sessionStorage.getItem(STORAGE_OPEN_KEY)) { sessionStorage.setItem(STORAGE_OPEN_KEY, '0'); } } catch (_) {}
    restoreMessagesFromStorage();
    
    // Restore the open/closed state from the last session
    if (sessionStorage.getItem(STORAGE_OPEN_KEY) === '1') {
        openChatWindow();
    } else {
        closeChatWindow();
    }
});
