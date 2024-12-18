export const stringFormatter = (text) => {
    return text
        .replace(/\n/g, "<br>") // Replace newlines with <br> tags
        .replace(
            /(https?:\/\/[^\s<>,]+)/g, // Match URLs properly
            (match) => {
                // If URL ends with punctuation (like period or comma), remove it
                const cleanUrl = match.replace(/([.,;!?])$/, '');
                return `<a href="${cleanUrl}" target="_blank" style="color:blue" rel="noopener noreferrer">haz clic aquí</a>`;
            }
        );
};
