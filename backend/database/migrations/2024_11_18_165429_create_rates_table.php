<?php

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
        Schema::create('rates', function (Blueprint $table) {
            $table->id();
            $table->string('code_number')->nullable();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_video_id')->constrained('user_videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->tinyInteger('rate_1');
            $table->tinyInteger('rate_2');
            $table->tinyInteger('rate_3');
            $table->tinyInteger('rate_4');
            $table->text('comment')->nullable();
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
        Schema::dropIfExists('rates');
    }
};
