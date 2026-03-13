<div>
    <div class="flex items-center justify-between mb-1">
        <h3 class="text-sm font-medium text-gray-700">Новые</h3>
        <button type="button" id="mark-all-read-btn" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
            Прочитать все
        </button>
    </div>
    <ul id="messages-new" class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
        @forelse($unreadMessages as $msg)
            @include('messages.partials.message-item', ['message' => $msg, 'unread' => true])
        @empty
            <li id="messages-new-empty" class="text-sm text-gray-500 py-2">Нет новых сообщений</li>
        @endforelse
    </ul>
</div>
