<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
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

        return view('messages.index', compact('user', 'users', 'receivedMessages'));
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
}
