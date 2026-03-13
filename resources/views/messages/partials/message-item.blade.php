<li class="msg-item rounded px-3 py-2 shadow-sm {{ $unread ? 'bg-indigo-50 border-l-4 border-indigo-500 cursor-pointer' : 'bg-white' }}" data-message-id="{{ $message->id }}">
    <div class="flex-1 min-w-0">
        <div class="text-sm text-gray-700">
            @if($unread)
                <span class="msg-unread-label text-xs font-semibold text-indigo-600 uppercase mr-1">Новое</span>
            @endif
            <strong>{{ $message->sender->name }}:</strong> {{ $message->body }}
        </div>
        <div class="text-xs text-gray-400 text-right">
            <time class="msg-time" datetime="{{ $message->created_at->utc()->toIso8601String() }}"></time>
        </div>
    </div>
</li>
