<div>
    <h2 class="font-semibold mb-2">Отправить сообщение</h2>
    <form id="message-form" class="space-y-2">
    @csrf
    <input type="hidden" name="receiver_id" id="receiver_id">
    <div id="message-form-errors" class="text-sm text-red-600 mb-2 hidden" role="alert"></div>
    <div>
        <textarea
            name="body"
            id="body"
            rows="3"
            class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Введите сообщение..."
        ></textarea>
        <p class="text-xs mt-1 text-gray-500" id="body-char-count">Символов: 0 из 1000</p>
    </div>
    <div class="flex justify-end">
        <button
            type="submit"
            id="send-btn"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled
        >
            Отправить
        </button>
    </div>
    </form>
</div>
