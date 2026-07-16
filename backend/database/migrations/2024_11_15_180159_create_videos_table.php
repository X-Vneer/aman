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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->json('video_url');
            $table->string('logo');
            $table->text('title');
            $table->json('description');
            $table->string('length');
            $table->string('color')->default('#fedcba');
            $table->decimal('price', 8, 2);
            $table->decimal('total_price', 8, 2)->default(0);
            $table->decimal('total_paid', 8, 2)->default(0);
            $table->decimal('total_discount', 8, 2)->virtualAs("total_price - total_paid");
            $table->integer('view_counter')->default(0);
            $table->integer('view_complete_counter')->default(0);
            $table->string('certificate_url')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            $table->index(['certificate_url']); // Optimize searches using certificate URLs
            $table->index(['created_at']); // Optimize sorting/filtering by creation date
            $table->index(['updated_at']); // Optimize queries tracking updates

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
