<div>
    <h3 class="text-sm font-medium text-gray-700 mb-1">История</h3>
    <ul id="messages-history" class="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
        @forelse($historyMessages as $msg)
            @include('messages.partials.message-item', ['message' => $msg, 'unread' => false])
        @empty
            <li id="messages-history-empty" class="text-sm text-gray-500 py-2">История пуста</li>
        @endforelse
    </ul>
</div>
