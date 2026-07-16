<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique(); // e.g. home_hero, brand_story, promo_banner
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('cta_text')->nullable();
            $table->string('cta_link')->nullable();
            $table->string('image_url')->nullable();
            $table->json('meta_data')->nullable(); // For timers, features checklists, social stats, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
