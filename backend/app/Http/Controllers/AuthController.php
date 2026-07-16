<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name ?? explode('@', $request->email)[0],
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign standard customer role
        $user->assignRole('customer');

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load('roles', 'profile'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(
            $request->user()->load('roles', 'profile', 'addresses')
        );
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'avatar' => 'nullable|image|max:2048',
        ]);

        if ($request->has('name')) {
            $user->update(['name' => $request->name]);
        }

        $profile = $user->profile;
        if (!$profile) {
            $profile = \App\Models\UserProfile::create([
                'user_id' => $user->id,
                'preferences' => ['cart' => []]
            ]);
        }

        if ($request->has('phone')) {
            $profile->update(['phone' => $request->phone]);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $profile->update(['avatar' => $path]);
        }

        return response()->json(
            $user->load('roles', 'profile', 'addresses')
        );
    }
}
