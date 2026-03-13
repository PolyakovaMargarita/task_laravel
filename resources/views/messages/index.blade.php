@extends('layouts.app')

@section('content')
    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1 class="text-2xl font-semibold mb-6">
                        Здравствуйте, {{ $user->name }}
                    </h1>

                    {{-- Блок 1: выбор пользователя и отправка сообщения (одним уровнем) --}}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        @include('messages.partials.user-list', ['users' => $users])
                        @include('messages.partials.message-form')
                    </div>

                    {{-- Блок 2: новые сообщения и история (другим уровнем) --}}
                    <div id="messages-container">
                        @include('messages.partials.messages-header')
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            @include('messages.partials.messages-new', ['unreadMessages' => $unreadMessages])
                            @include('messages.partials.messages-history', ['historyMessages' => $historyMessages])
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
