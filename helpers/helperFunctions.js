export const stringFormatter = (text) => {
    if (typeof text !== "string") return "Not a string";

    return text
        .replace(/\n/g, "<br>")
        .replace(/\[.*?\]/g, "")
        .replace(/[()]/g, "")
        .replace(/(https?:\/\/[^\s<>,]+)/g, (match) => {
            const cleanUrl = match.replace(/([.,;!?])$/, "");
            return `<a href="${cleanUrl}" target="_blank" class="chat-link-text" rel="noopener noreferrer">Haz clic aquí</a>`;
        })
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};
