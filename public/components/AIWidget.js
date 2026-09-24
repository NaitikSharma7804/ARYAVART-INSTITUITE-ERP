// A reusable component to be injected into modules
class AIWidget {
    constructor(moduleId) {
        this.moduleId = moduleId;
    }

    render() {
        return `
            <div id="ai-panel-${this.moduleId}" class="ai-widget">
                <input type="text" id="ai-input" placeholder="Ask AI about this page...">
                <div id="ai-response"></div>
            </div>
        `;
    }

    async ask(query) {
        const response = await api.post('/ai/query', { query, context: this.moduleId });
        // Stream response handling
    }
}