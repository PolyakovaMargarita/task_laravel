<?php

use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    require __DIR__.'/auth.php';
});

Route::middleware(['web', 'auth', 'verified'])->group(function () {
    Route::get('/dashboard', [MessageController::class, 'index'])->name('dashboard');
});

Route::middleware(['web', 'auth', 'throttle:60,1'])->group(function () {
    Route::post('/messages', [MessageController::class, 'store'])->name('api.messages.store');
    Route::post('/messages/mark-read', [MessageController::class, 'markRead'])->name('api.messages.mark-read');
    Route::patch('/messages/{message}/read', [MessageController::class, 'markOneRead'])->name('api.messages.mark-one-read');
});

