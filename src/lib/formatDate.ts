

export const FormatDate = (dateString: string) => {
    if (!dateString) return "";

    const userdate = new Date(dateString);
    if (Number.isNaN(userdate.getTime())) return dateString;

    const now = new Date();
    const isSameDay = userdate.toDateString() === now.toDateString();

    return isSameDay
        ? userdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
        : userdate.toLocaleDateString("en-US");
};