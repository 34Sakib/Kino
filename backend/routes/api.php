<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageSectionController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

// --- Auth Endpoints ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    
    // --- Database Cart Endpoints ---
    Route::get('/cart', [CartController::class, 'get']);
    Route::post('/cart/update', [CartController::class, 'update']);
    Route::post('/cart/merge', [CartController::class, 'merge']);

    // --- Database Order Endpoints ---
    Route::get('/orders', [OrderController::class, 'index']);

    // --- Database Wishlist Endpoints ---
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);

    // --- Database Review Submission ---
    Route::post('/products/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'store']);
});

// --- Catalog Endpoints ---
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{id}/related', [ProductController::class, 'related']);
Route::get('/categories', [ProductController::class, 'categories']);

// --- Checkout & Payments Endpoints ---
Route::post('/checkout/session', [CheckoutController::class, 'createPaymentIntent']);
Route::post('/checkout/confirm', [CheckoutController::class, 'confirmOrder']);

// --- Page Content Endpoints ---
Route::get('/sections', [PageSectionController::class, 'index']);
Route::get('/sections/{key}', [PageSectionController::class, 'show']);
Route::get('/faqs', [\App\Http\Controllers\FAQController::class, 'index']);
Route::get('/reviews', [\App\Http\Controllers\ReviewController::class, 'index']);
Route::get('/products/{id}/reviews', [\App\Http\Controllers\ReviewController::class, 'productReviews']);
Route::get('/posts', [\App\Http\Controllers\PostController::class, 'index']);
Route::get('/posts/{slug}', [\App\Http\Controllers\PostController::class, 'show']);
Route::get('/orders/track/{order_number}', [\App\Http\Controllers\OrderController::class, 'track']);
Route::post('/checkout/validate-coupon', [\App\Http\Controllers\CheckoutController::class, 'validateCoupon']);
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store']);
Route::get('/settings', [SettingController::class, 'index']);



