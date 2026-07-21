<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Widen videos.logo so a pasted external cover-image URL (CDN / signed links can exceed 191 chars)
    // fits the VideoStoreRequest 'logo' max:500 rule instead of throwing a DB truncation error.
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->string('logo', 500)->change();
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->string('logo', 191)->change();
        });
    }
};
