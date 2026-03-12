<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    require __DIR__.'/auth.php';
});

Route::middleware(['web', 'auth', 'verified'])->group(function () {
    Route::get('/dashboard', [MessageController::class, 'index'])->name('dashboard');
});

Route::middleware(['web', 'auth', 'throttle:60,1'])->group(function () {
    Route::post('/messages', [MessageController::class, 'store'])->name('api.messages.store');
});

Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
