<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use Illuminate\Support\Facades\Route;

// --- Auth Endpoints ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // --- Database Cart Endpoints ---
    Route::get('/cart', [CartController::class, 'get']);
    Route::post('/cart/update', [CartController::class, 'update']);
    Route::post('/cart/merge', [CartController::class, 'merge']);
});

// --- Catalog Endpoints ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{id}/related', [ProductController::class, 'related']);
Route::get('/categories', [ProductController::class, 'categories']);

// --- Checkout & Payments Endpoints ---
Route::post('/checkout/session', [CheckoutController::class, 'createPaymentIntent']);
Route::post('/checkout/confirm', [CheckoutController::class, 'confirmOrder']);

