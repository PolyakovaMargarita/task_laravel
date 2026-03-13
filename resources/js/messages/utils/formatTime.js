/**
 * Форматирование времени сообщения (дата + время в локальной локали).
 * SRP: единственная ответственность — преобразование ISO-строки в читаемый вид.
 */
export function formatMessageTime(isoString) {
    if (!isoString) return "";
    try {
        const d = new Date(isoString);
        const datePart = d.toLocaleString(undefined, {
            day: "2-digit",
            month: "long",
        });
        const timePart = d.toLocaleString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        return `${datePart}, ${timePart}`;
    } catch (_) {
        return isoString;
    }
}
