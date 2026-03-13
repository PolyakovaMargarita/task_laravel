/**
 * Форма отправки сообщения: счётчик символов, состояние кнопки, отправка.
 * SRP: только логика формы и лимит символов.
 */

const DEFAULT_MAX_LENGTH = 1000;

export function countCharacters(str) {
    return [...(str || "")].length;
}

/**
 * Инициализирует форму: счётчик символов, кнопка «Отправить» (sendBtnEl), отправка.
 * Возвращает { updateSendButtonState } для вызова при смене получателя.
 */
export function initMessageForm({
    formEl,
    bodyInputEl,
    receiverInputEl,
    sendBtnEl, // id="send-btn" в message-form.blade.php
    charCountEl,
    errorsEl,
    getToken,
    maxLength = DEFAULT_MAX_LENGTH,
}) {
    if (!formEl || !bodyInputEl || !sendBtnEl) return { updateSendButtonState: () => {} };

    function updateSendButtonState() {
        if (!sendBtnEl) return;
        const text = (bodyInputEl.value || "").trim();
        const overLimit = countCharacters(text) > maxLength;
        sendBtnEl.disabled =
            !receiverInputEl?.value || !text || overLimit;
    }

    function updateBodyCharCount() {
        if (!charCountEl) return;
        const text = (bodyInputEl.value || "").trim();
        const n = countCharacters(text);
        const over = n > maxLength;
        const left = maxLength - n;
        let msg = `Символов: ${n} из ${maxLength}`;
        if (over) {
            msg += ` (превышен лимит на ${n - maxLength})`;
        } else if (left >= 0 && left < 100) {
            msg += ` (осталось ${left})`;
        }
        charCountEl.textContent = msg;
        charCountEl.classList.toggle("text-red-600", over);
        charCountEl.classList.toggle("text-gray-500", !over);
        charCountEl.setAttribute("data-over-limit", over ? "true" : "false");
        updateSendButtonState();
    }

    function hideErrors() {
        if (errorsEl) {
            errorsEl.classList.add("hidden");
            errorsEl.textContent = "";
        }
    }

    function showError(text) {
        if (errorsEl) {
            errorsEl.classList.remove("hidden");
            errorsEl.textContent = text;
        }
    }

    bodyInputEl.addEventListener("input", () => {
        updateBodyCharCount();
        hideErrors();
    });

    formEl.addEventListener("submit", async (event) => {
        event.preventDefault();
        const token = getToken?.();

        if (!receiverInputEl?.value || !bodyInputEl.value.trim()) return;

        const trimmedBody = bodyInputEl.value.trim();
        if (countCharacters(trimmedBody) > maxLength) {
            showError(
                `Сократите сообщение до ${maxLength} символов. Сейчас: ${countCharacters(trimmedBody)}.`,
            );
            return;
        }

        const originalText = sendBtnEl?.textContent ?? "Отправить";
        if (sendBtnEl) {
            sendBtnEl.disabled = true;
            sendBtnEl.textContent = "Отправка…";
        }

        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": token,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    receiver_id: receiverInputEl.value,
                    body: trimmedBody,
                }),
            });

            if (response.ok) {
                bodyInputEl.value = "";
                updateBodyCharCount();
                hideErrors();
            } else {
                try {
                    const data = await response.json();
                    const messages =
                        data.errors?.body ||
                        (data.message ? [data.message] : ["Ошибка отправки сообщения"]);
                    showError(
                        Array.isArray(messages) ? messages.join(" ") : messages,
                    );
                } catch (_) {
                    showError("Ошибка отправки сообщения");
                }
            }
        } finally {
            if (sendBtnEl) {
                sendBtnEl.textContent = originalText;
                updateSendButtonState();
            }
        }
    });

    updateBodyCharCount();
    updateSendButtonState();

    return { updateSendButtonState };
}
