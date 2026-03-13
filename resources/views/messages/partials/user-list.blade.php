<div>
    <h2 class="font-semibold mb-2">Пользователи</h2>
    <ul id="user-list" class="space-y-1">
        @forelse($users as $u)
            <li
                class="user-item cursor-pointer px-3 py-2 rounded border border-gray-200 hover:bg-gray-100"
                data-user-id="{{ $u->id }}"
            >
                {{ $u->name }} <span class="text-gray-500 text-sm">({{ $u->email }})</span>
            </li>
        @empty
            <li id="user-list-empty" class="text-sm text-gray-500 py-2">Нет пользователей</li>
        @endforelse
    </ul>
</div>
