<?php

use Illuminate\Support\Facades\Broadcast;

/**
 * Private channel for user-specific events (e.g. incoming messages).
 * Only the user whose id matches the channel id may subscribe.
 * Unauthorized subscription attempts are rejected by Laravel before Reverb accepts the connection.
 */
Broadcast::channel('user.{id}', function ($user, int $id) {
    return $user->id === $id;
});

