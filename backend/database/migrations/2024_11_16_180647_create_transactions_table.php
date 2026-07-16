<?php

use App\Enums\Lang;
use App\Enums\VideoPaymentStatus;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('user_video_id')->constrained('user_videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('order_id');
            $table->string('trans_id')->nullable();
            $table->string('hash')->nullable();
            $table->string('result')->nullable();
            $table->string('status')->default('Init');
            $table->string('card')->nullable();
            $table->json('request');
            $table->json('response')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
