/**
 * Логика "прочитать все" и "прочитать одно" сообщение.
 * SRP: только API и обновление UI списков (новые → история).
 */

const JSON_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

function createRequestHeaders(token) {
    return {
        ...JSON_HEADERS,
        "X-CSRF-TOKEN": token,
    };
}

function appendEmptyNewPlaceholder(listNew) {
    const empty = document.createElement("li");
    empty.id = "messages-new-empty";
    empty.className = "text-sm text-gray-500 py-2";
    empty.textContent = "Нет новых сообщений";
    listNew.appendChild(empty);
}

function moveItemToReadStyle(li) {
    li.classList.remove(
        "bg-indigo-50",
        "border-l-4",
        "border-indigo-500",
        "cursor-pointer",
    );
    li.classList.add("bg-white");
    li.querySelector(".msg-unread-label")?.remove();
}

/**
 * Возвращает обработчик "Прочитать все" для переданных элементов.
 */
export function createMarkAllReadHandler({ getToken, listNew, listHistory }) {
    return function markMessagesAsReadAndUpdateUI() {
        const token = getToken();
        if (!listNew || !listHistory || !token) return;
        fetch("/api/messages/mark-read", {
            method: "POST",
            headers: createRequestHeaders(token),
        })
            .then((res) => {
                if (!res.ok) return;
                const items = Array.from(listNew.querySelectorAll(".msg-item"));
                document.getElementById("messages-new-empty")?.remove();
                document.getElementById("messages-history-empty")?.remove();
                items.reverse().forEach((li) => {
                    moveItemToReadStyle(li);
                    listHistory.prepend(li);
                });
                if (listNew.querySelectorAll(".msg-item").length === 0) {
                    appendEmptyNewPlaceholder(listNew);
                }
            })
            .catch(() => {});
    };
}

/**
 * Подключает делегированный клик по сообщению в контейнере: отметка одного как прочитанного.
 */
export function bindMarkOneRead({ container, listNew, listHistory, getToken }) {
    if (!container) return;
    container.addEventListener("click", (ev) => {
        const li = ev.target.closest(".msg-item");
        if (
            !li ||
            !listNew?.contains(li) ||
            !li.querySelector(".msg-unread-label")
        )
            return;
        const id = li.dataset.messageId;
        if (!id) return;
        const token = getToken();
        if (!token || !listHistory) return;
        fetch(`/api/messages/${id}/read`, {
            method: "PATCH",
            headers: createRequestHeaders(token),
        })
            .then((res) => {
                if (res.ok) {
                    document.getElementById("messages-history-empty")?.remove();
                    moveItemToReadStyle(li);
                    listHistory.prepend(li);
                    if (listNew.querySelectorAll(".msg-item").length === 0) {
                        appendEmptyNewPlaceholder(listNew);
                    }
                }
            })
            .catch(() => {});
    });
}
