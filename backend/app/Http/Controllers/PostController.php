<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        // Get posts which have a valid publish date, sorted newest first
        $posts = Post::orderBy('published_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($posts);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        return response()->json($post);
    }
}
