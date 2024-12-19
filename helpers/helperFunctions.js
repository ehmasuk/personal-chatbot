export const stringFormatter = (text) => {
    return text
        .replace(/\n/g, "<br>") // Replace newlines with <br> tags
        .replace(
            /(https?:\/\/[^\s<>,]+)/g, // Match URLs properly
            (match) => {
                // If URL ends with punctuation (like period or comma), remove it
                const cleanUrl = match.replace(/([.,;!?])$/, "");
                return `<a href="${cleanUrl}" target="_blank" class="chat-link-text" rel="noopener noreferrer">Haz clic aquí</a>`;
            }
        )
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // Replace text between ** with bold
};
