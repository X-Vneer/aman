<?php

use App\Enums\AnswerOption;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->json('question');
            $table->json('answers_a');
            $table->json('answers_b');
            $table->json('answers_c')->nullable();
            $table->json('answers_d')->nullable();
            $table->json('wrong_a')->nullable();
            $table->json('wrong_b')->nullable();
            $table->json('wrong_c')->nullable();
            $table->json('wrong_d')->nullable();
            $table->enum('correct_answer', array_map(fn($case) => $case->value, AnswerOption::cases()));
            $table->string('allowed_time')->default('04:00:00');
            $table->json('appears_at')->default('{"ar": "00:00:00", "en": "00:00:00", "fr": "00:00:00", "ur": "00:00:00", "fil": "00:00:00", "id": "00:00:00"}');
            $table->json('wrong_answer_audio_urls');
            $table->timestamps();

            $table->index(['created_at']); // Optimize sorting/filtering by creation date
            $table->index(['updated_at']); // Optimize tracking updates
        });
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
