/**
 * Инициализация дашборда сообщений: сборка зависимостей и подключение модулей.
 * OCP: добавление нового поведения — через новые модули, без правок этой сборки.
 */

import { formatMessageTime } from "./utils/formatTime.js";
import { createMarkAllReadHandler, bindMarkOneRead } from "./markRead.js";
import { initRealtime } from "./realtime.js";
import { initMessageForm } from "./form.js";

function getToken() {
    return document.querySelector('input[name="_token"]')?.value;
}

function getElement(id) {
    return document.getElementById(id);
}

/**
 * Запуск дашборда только при наличии currentUserId (страница сообщений).
 */
export function initDashboard() {
    if (typeof window.currentUserId === "undefined") return;

    const listNew = getElement("messages-new");
    const listHistory = getElement("messages-history");
    const messagesContainer = getElement("messages-container");
    const userList = getElement("user-list");
    const receiverInput = getElement("receiver_id");
    const formEl = getElement("message-form");
    const bodyInput = getElement("body");
    const sendBtn = getElement("send-btn"); // Кнопка «Отправить» (см. message-form.blade.php)
    const charCountEl = getElement("body-char-count");
    const errorsEl = getElement("message-form-errors");

    // Форматирование времени у уже отрендеренных сообщений
    document.querySelectorAll(".msg-time").forEach((el) => {
        const dt = el.getAttribute("datetime");
        if (dt) el.textContent = formatMessageTime(dt);
    });

    // Realtime: WebSocket подписки
    initRealtime({
        currentUserId: window.currentUserId,
        listNew,
        userList,
    });

    // Прочитать все / прочитать одно
    const markAllRead = createMarkAllReadHandler({
        getToken,
        listNew,
        listHistory,
    });
    getElement("mark-all-read-btn")?.addEventListener("click", markAllRead);
    bindMarkOneRead({
        container: messagesContainer,
        listNew,
        listHistory,
        getToken,
    });

    // Форма отправки (возвращает обновление кнопки для связи с выбором получателя)
    const { updateSendButtonState } = initMessageForm({
        formEl,
        bodyInputEl: bodyInput,
        receiverInputEl: receiverInput,
        sendBtnEl: sendBtn,
        charCountEl,
        errorsEl,
        getToken,
    });

    // Выбор получателя
    userList?.addEventListener("click", (ev) => {
        const item = ev.target.closest(".user-item");
        if (!item) return;
        document
            .querySelectorAll(".user-item")
            .forEach((i) =>
                i.classList.remove("bg-indigo-50", "border-indigo-400"),
            );
        item.classList.add("bg-indigo-50", "border-indigo-400");
        receiverInput.value = item.dataset.userId;
        updateSendButtonState();
    });
}
