<?php

namespace App\Services;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MessageService
{
    public function getUsersExcept(User $current): iterable
    {
        return User::where('id', '!=', $current->id)->get();
    }

    public function getMessagesForUser(User $user): iterable
    {
        return Message::where('receiver_id', $user->id)
            ->with('sender')
            ->orderByDesc('created_at')
            ->get();
    }

    public function sendMessage(User $sender, int $receiverId, string $body): Message
    {
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'body' => $body,
        ]);

        $message->load('sender');
        broadcast(new MessageSent($message))->toOthers();

        return $message;
    }

    public function markAllAsReadForUser(User $user): void
    {
        Message::where('receiver_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function markOneAsRead(Message $message, User $user): bool
    {
        if ($message->receiver_id !== $user->id) {
            return false;
        }
        if ($message->read_at !== null) {
            return true;
        }
        $message->update(['read_at' => now()]);
        return true;
    }
}

