<?php

use App\Models\Story;
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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);

            // Virtual Column for full_name
            $table->string('full_name')->virtualAs("CONCAT(first_name, ' ', last_name)");

            $table->string('title', 255);
            $table->string('mobile', 20);
            $table->string('email', 255);
            $table->integer('age');
            $table->unsignedBigInteger('video_id')->nullable();
            $table->string('locale', 10)->default('en'); // Store current app locale
            $table->text('content');
            $table->string('program_name')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            // Foreign key constraint for video_id
            $table->foreign('video_id')->references('id')->on('videos')->onDelete('set null');

            // Optimize searches by name
            $table->index(['first_name']);
            $table->index(['last_name']);
            $table->index(['full_name']);

            // Optimize lookups using email and mobile
            $table->index(['email']);
            $table->index(['mobile']);

            // Optimize video relationship queries
            $table->index(['video_id']);

            // Optimize locale queries
            $table->index(['locale']);

            // Optimize sorting/filtering by timestamps
            $table->index(['created_at']);
            $table->index(['updated_at']);
        });

        // Create a sample story
        Story::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'title' => 'My Success Story',
            'mobile' => '+1234567890',
            'email' => 'john.doe@example.com',
            'age' => 30,
            'video_id' => null,
            'locale' => 'en',
            'content' => 'This is a sample success story content.',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
