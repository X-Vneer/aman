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
        Schema::create('user_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_video_id')->constrained('user_videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_id',)->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('video_id',)->constrained('videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('question_id',)->constrained('questions')->nullable();
            $table->enum('user_answer', array_map(fn($case) => $case->value, AnswerOption::cases()))->nullable();
            $table->boolean('status',);
            $table->string('answer_time',);
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
        Schema::dropIfExists('user_answers');
    }
};
