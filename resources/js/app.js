import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.currentUserId === 'undefined') {
        return;
    }

    // Подписка на приватный канал пользователя
    window.Echo.private(`user.${window.currentUserId}`)
        .listen('.message.sent', (e) => {
            const list = document.getElementById('messages');
            if (!list) return;

            const li = document.createElement('li');
            li.className = 'bg-white rounded px-3 py-2 shadow-sm';
            li.innerHTML = `
                <div class="text-sm text-gray-700">
                    <strong>${e.sender_id}:</strong> ${e.body}
                </div>
                <div class="text-xs text-gray-400 text-right">
                    ${e.created_at}
                </div>
            `;
            list.prepend(li);
        });

    const userItems = document.querySelectorAll('.user-item');
    const receiverInput = document.getElementById('receiver_id');
    const sendBtn = document.getElementById('send-btn');

    userItems.forEach((item) => {
        item.addEventListener('click', () => {
            userItems.forEach((i) => i.classList.remove('bg-indigo-50', 'border-indigo-400'));
            item.classList.add('bg-indigo-50', 'border-indigo-400');
            receiverInput.value = item.dataset.userId;
            if (sendBtn) {
                sendBtn.disabled = false;
            }
        });
    });

    const form = document.getElementById('message-form');
    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const bodyInput = document.getElementById('body');
        const token = form.querySelector('input[name="_token"]').value;

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                receiver_id: receiverInput.value,
                body: bodyInput.value,
            }),
        });

        if (response.ok) {
            bodyInput.value = '';
        } else {
            console.error('Ошибка отправки сообщения');
        }
    });
});
