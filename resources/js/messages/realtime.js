/**
 * Подписки WebSocket (Reverb): новые сообщения и новые пользователи.
 * SRP: только подписка на каналы и вызов колбэков при событиях.
 */

import { formatMessageTime } from "./utils/formatTime.js";

const EMPTY_NEW_PLACEHOLDER_ID = "messages-new-empty";

function removeEmptyNewPlaceholder() {
    document.getElementById(EMPTY_NEW_PLACEHOLDER_ID)?.remove();
}

/**
 * Создаёт DOM-элемент нового сообщения для вставки в список.
 */
function buildNewMessageElement(payload, formatTime = formatMessageTime) {
    const senderLabel = payload.sender_name || `User #${payload.sender_id}`;
    const timeText = formatTime(payload.created_at);
    const msgId = payload.id || "";
    const li = document.createElement("li");
    li.className =
        "msg-item bg-indigo-50 border-l-4 border-indigo-500 rounded px-3 py-2 shadow-sm cursor-pointer";
    li.dataset.messageId = msgId;
    li.innerHTML = `
        <div class="flex-1 min-w-0">
            <div class="text-sm text-gray-700">
                <span class="msg-unread-label text-xs font-semibold text-indigo-600 uppercase mr-1">Новое</span>
                <strong>${senderLabel}:</strong> ${payload.body}
            </div>
            <div class="text-xs text-gray-400 text-right">
                ${timeText}
            </div>
        </div>
    `;
    return li;
}

/**
 * Создаёт DOM-элемент пункта пользователя для списка.
 */
function buildUserListItem(payload) {
    const li = document.createElement("li");
    li.className =
        "user-item cursor-pointer px-3 py-2 rounded border border-gray-200 hover:bg-gray-100";
    li.dataset.userId = payload.id;
    const nameSpan = document.createElement("span");
    nameSpan.textContent = payload.name || `User #${payload.id}`;
    const emailSpan = document.createElement("span");
    emailSpan.className = "text-gray-500 text-sm";
    emailSpan.textContent = ` (${payload.email || ""})`;
    li.appendChild(nameSpan);
    li.appendChild(emailSpan);
    return li;
}

/**
 * Подключает подписки Reverb для дашборда сообщений.
 * @param {{ currentUserId: number, listNew: HTMLElement | null, userList: HTMLElement | null }} deps
 */
export function initRealtime({ currentUserId, listNew, userList }) {
    const channelName = `user.${currentUserId}`;

    window.Echo.private(channelName)
        .listen(".message.sent", (e) => {
            console.log("[WebSocket] Получено сообщение:", e);
            if (!listNew) return;
            removeEmptyNewPlaceholder();
            const li = buildNewMessageElement(e);
            listNew.prepend(li);
        })
        .error((err) => {
            console.error("[WebSocket] Ошибка канала:", err);
        });

    window.Echo.channel("users")
        .listen(".user.registered", (e) => {
            if (Number(e.id) === Number(currentUserId)) return;
            if (!userList) return;
            if (userList.querySelector(`[data-user-id="${e.id}"]`)) return;
            document.getElementById("user-list-empty")?.remove();
            userList.appendChild(buildUserListItem(e));
        })
        .error((err) => {
            console.error("[WebSocket] Ошибка канала users:", err);
        });

    try {
        const conn = window.Echo?.connector?.pusher?.connection;
        if (conn) {
            conn.bind("connected", () =>
                console.log(
                    "[WebSocket] Подключено к Reverb, канал:",
                    channelName,
                ),
            );
            conn.bind("unavailable", () =>
                console.warn(
                    "[WebSocket] Reverb недоступен. Запустите: docker compose up -d reverb",
                ),
            );
        }
    } catch (_) {}
}
