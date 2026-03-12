@extends('layouts.app')

@section('content')
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="text-2xl font-semibold mb-4">
                        Здравствуйте, {{ $user->name }}
                    </h1>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h2 class="font-semibold mb-2">Пользователи</h2>
                            <ul id="user-list" class="space-y-1">
                                @foreach($users as $u)
                                    <li
                                        class="user-item cursor-pointer px-3 py-2 rounded border border-gray-200 hover:bg-gray-100"
                                        data-user-id="{{ $u->id }}"
                                    >
                                        {{ $u->name }} <span class="text-gray-500 text-sm">({{ $u->email }})</span>
                                    </li>
                                @endforeach
                            </ul>
                        </div>

                        <div class="md:col-span-2">
                            <h2 class="font-semibold mb-2">Сообщения для вас</h2>

                            <ul id="messages" class="space-y-2 mb-4 max-h-80 overflow-y-auto border border-gray-200 rounded p-2 bg-gray-50">
                                @foreach($receivedMessages as $msg)
                                    <li class="bg-white rounded px-3 py-2 shadow-sm">
                                        <div class="text-sm text-gray-700">
                                            <strong>{{ $msg->sender->name }}:</strong> {{ $msg->body }}
                                        </div>
                                        <div class="text-xs text-gray-400 text-right">
                                            {{ $msg->created_at }}
                                        </div>
                                    </li>
                                @endforeach
                            </ul>

                            <form id="message-form" class="space-y-2">
                                @csrf
                                <input type="hidden" name="receiver_id" id="receiver_id">
                                <div>
                                    <textarea
                                        name="body"
                                        id="body"
                                        rows="3"
                                        class="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Введите сообщение..."
                                    ></textarea>
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
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        window.currentUserId = {{ $user->id }};
    </script>
@endsection

