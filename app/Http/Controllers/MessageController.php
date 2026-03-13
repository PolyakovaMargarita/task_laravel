<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function __construct(
        private readonly MessageService $service,
    ) {
    }

    public function index()
    {
        $user = Auth::user();

        $users = $this->service->getUsersExcept($user);
        $receivedMessages = $this->service->getMessagesForUser($user);
        $unreadMessages = $receivedMessages->filter(fn ($m) => $m->isUnread())->values();
        $historyMessages = $receivedMessages->filter(fn ($m) => !$m->isUnread())->values();

        return view('messages.index', compact('user', 'users', 'unreadMessages', 'historyMessages'));
    }

    public function store(StoreMessageRequest $request)
    {
        $message = $this->service->sendMessage(
            Auth::user(),
            $request->integer('receiver_id'),
            $request->string('body')->toString(),
        );

        return response()->json([
            'status' => 'ok',
            'message' => new MessageResource($message),
        ]);
    }

    public function markRead()
    {
        $this->service->markAllAsReadForUser(Auth::user());

        return response()->json(['status' => 'ok']);
    }

    public function markOneRead(Message $message)
    {
        if (!$this->service->markOneAsRead($message, Auth::user())) {
            return response()->json(['status' => 'error'], 403);
        }

        return response()->json(['status' => 'ok']);
    }
}
