async function student_aichat() {
    setTitle("AI Chat", "Aryavart AI Assistant");
    
    return `
        <div class="card">
            <h3>Aryavart AI Assistant</h3>
            <textarea id="ai-chat-input" class="full-width" rows="4" placeholder="Ask AI about your syllabus..."></textarea>
            <button class="btn primary" style="margin-top:10px;" onclick="askAI()">Ask AI</button>
            <div id="ai-response-box" style="margin-top:20px; display:none; padding:15px; background:var(--bg); border-radius:8px;">
                <strong>AI Response:</strong>
                <p id="ai-response-text"></p>
            </div>
        </div>
    `;
}

async function askAI() {
    const question = document.getElementById('ai-chat-input').value;
    const responseBox = document.getElementById('ai-response-box');
    const responseText = document.getElementById('ai-response-text');

    if (!question.trim()) return showToast("Enter a question!");

    responseBox.style.display = 'block';
    responseText.innerText = "Searching...";

    try {
        // This is the only place your AI API is called now
        const response = await fetch('http://localhost:5000/api/doubt/ask', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        responseText.innerText = data.success ? data.answer : "Error: " + data.message;
    } catch (err) {
        responseText.innerText = "Connection error.";
    }
}