<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The wrong-answer explanation is now plain text (wrong_a/b/c); the uploaded
     * per-answer audio feature was removed, so drop its column.
     */
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'wrong_answer_audio_urls')) {
                $table->dropColumn('wrong_answer_audio_urls');
            }
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (! Schema::hasColumn('questions', 'wrong_answer_audio_urls')) {
                $table->json('wrong_answer_audio_urls')->nullable();
            }
        });
    }
};
