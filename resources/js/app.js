import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

function formatMessageTime(isoString) {
    if (!isoString) return '';
    try {
        const d = new Date(isoString);
        const datePart = d.toLocaleString(undefined, { day: '2-digit', month: 'long' });
        const timePart = d.toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        return `${datePart}, ${timePart}`;
    } catch (_) {
        return isoString;
    }
}

function markMessagesAsReadAndUpdateUI() {
    const listNew = document.getElementById('messages-new');
    const listHistory = document.getElementById('messages-history');
    const token = document.querySelector('input[name="_token"]')?.value;
    if (!listNew || !listHistory || !token) return;
    fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((res) => {
        if (!res.ok) return;
        const items = Array.from(listNew.querySelectorAll('.msg-item'));
        document.getElementById('messages-new-empty')?.remove();
        items.reverse().forEach((li) => {
            li.classList.remove('bg-indigo-50', 'border-l-4', 'border-indigo-500', 'cursor-pointer');
            li.classList.add('bg-white');
            li.querySelector('.msg-unread-label')?.remove();
            listHistory.prepend(li);
        });
        if (listNew.querySelectorAll('.msg-item').length === 0) {
            const empty = document.createElement('li');
            empty.id = 'messages-new-empty';
            empty.className = 'text-sm text-gray-500 py-2';
            empty.textContent = 'Нет новых сообщений';
            listNew.appendChild(empty);
        }
    }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.currentUserId === 'undefined') {
        return;
    }

    document.querySelectorAll('.msg-time').forEach((el) => {
        const dt = el.getAttribute('datetime');
        if (dt) el.textContent = formatMessageTime(dt);
    });

    const channelName = `user.${window.currentUserId}`;

    // Подписка на приватный канал пользователя
    window.Echo.private(channelName)
        .listen('.message.sent', (e) => {
            console.log('[WebSocket] Получено сообщение:', e);
            const listNew = document.getElementById('messages-new');
            if (!listNew) return;

            document.getElementById('messages-new-empty')?.remove();

            const senderLabel = e.sender_name || `User #${e.sender_id}`;
            const timeText = formatMessageTime(e.created_at);
            const msgId = e.id || '';
            const li = document.createElement('li');
            li.className = 'msg-item bg-indigo-50 border-l-4 border-indigo-500 rounded px-3 py-2 shadow-sm cursor-pointer';
            li.dataset.messageId = msgId;
            li.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-700">
                        <span class="msg-unread-label text-xs font-semibold text-indigo-600 uppercase mr-1">Новое</span>
                        <strong>${senderLabel}:</strong> ${e.body}
                    </div>
                    <div class="text-xs text-gray-400 text-right">
                        ${timeText}
                    </div>
                </div>
            `;
            listNew.prepend(li);
        })
        .error((err) => {
            console.error('[WebSocket] Ошибка канала:', err);
        });

    // Подписка на появление новых пользователей (публичный канал)
    window.Echo.channel('users')
        .listen('.user.registered', (e) => {
            if (Number(e.id) === Number(window.currentUserId)) return;
            const list = document.getElementById('user-list');
            if (!list) return;
            if (list.querySelector(`[data-user-id="${e.id}"]`)) return;
            const li = document.createElement('li');
            li.className = 'user-item cursor-pointer px-3 py-2 rounded border border-gray-200 hover:bg-gray-100';
            li.dataset.userId = e.id;
            li.textContent = '';
            const nameSpan = document.createElement('span');
            nameSpan.textContent = e.name || `User #${e.id}`;
            const emailSpan = document.createElement('span');
            emailSpan.className = 'text-gray-500 text-sm';
            emailSpan.textContent = ` (${e.email || ''})`;
            li.appendChild(nameSpan);
            li.appendChild(emailSpan);
            list.appendChild(li);
        })
        .error((err) => {
            console.error('[WebSocket] Ошибка канала users:', err);
        });

    try {
        const conn = window.Echo?.connector?.pusher?.connection;
        if (conn) {
            conn.bind('connected', () => console.log('[WebSocket] Подключено к Reverb, канал:', channelName));
            conn.bind('unavailable', () => console.warn('[WebSocket] Reverb недоступен. Запустите: docker compose up -d reverb'));
        }
    } catch (_) {}

    document.getElementById('mark-all-read-btn')?.addEventListener('click', markMessagesAsReadAndUpdateUI);

    document.getElementById('messages-container')?.addEventListener('click', (ev) => {
        const li = ev.target.closest('.msg-item');
        if (!li || !document.getElementById('messages-new')?.contains(li) || !li.querySelector('.msg-unread-label')) return;
        const id = li.dataset.messageId;
        if (!id) return;
        const token = document.querySelector('input[name="_token"]')?.value;
        if (!token) return;
        const listHistory = document.getElementById('messages-history');
        if (!listHistory) return;
        fetch(`/api/messages/${id}/read`, {
            method: 'PATCH',
            headers: {
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            if (res.ok) {
                li.classList.remove('bg-indigo-50', 'border-l-4', 'border-indigo-500', 'cursor-pointer');
                li.classList.add('bg-white');
                li.querySelector('.msg-unread-label')?.remove();
                listHistory.prepend(li);
                if (document.getElementById('messages-new')?.querySelectorAll('.msg-item').length === 0) {
                    const empty = document.createElement('li');
                    empty.id = 'messages-new-empty';
                    empty.className = 'text-sm text-gray-500 py-2';
                    empty.textContent = 'Нет новых сообщений';
                    document.getElementById('messages-new').appendChild(empty);
                }
            }
        }).catch(() => {});
    });

    const receiverInput = document.getElementById('receiver_id');
    const sendBtn = document.getElementById('send-btn');

    document.getElementById('user-list')?.addEventListener('click', (ev) => {
        const item = ev.target.closest('.user-item');
        if (!item) return;
        document.querySelectorAll('.user-item').forEach((i) => i.classList.remove('bg-indigo-50', 'border-indigo-400'));
        item.classList.add('bg-indigo-50', 'border-indigo-400');
        receiverInput.value = item.dataset.userId;
        if (sendBtn) sendBtn.disabled = false;
    });

    const form = document.getElementById('message-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const bodyInput = document.getElementById('body');
        const token = form.querySelector('input[name="_token"]').value;

        if (!receiverInput.value || !bodyInput.value.trim()) return;

        const originalText = sendBtn?.textContent ?? 'Отправить';
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.textContent = 'Отправка…';
        }

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    receiver_id: receiverInput.value,
                    body: bodyInput.value.trim(),
                }),
            });

            if (response.ok) {
                bodyInput.value = '';
            } else {
                console.error('Ошибка отправки сообщения');
            }
        } finally {
            if (sendBtn) {
                sendBtn.disabled = !receiverInput.value;
                sendBtn.textContent = originalText;
            }
        }
    });
});
