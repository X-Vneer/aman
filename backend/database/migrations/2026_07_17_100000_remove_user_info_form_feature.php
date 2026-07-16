<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Remove the user-info questionnaire feature: drop the user_infos table
     * and the (always-0, now unused) has_form flag on user_videos.
     */
    public function up(): void
    {
        Schema::dropIfExists('user_infos');

        if (Schema::hasColumn('user_videos', 'has_form')) {
            Schema::table('user_videos', function (Blueprint $table) {
                $table->dropColumn('has_form');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('user_videos', 'has_form')) {
            Schema::table('user_videos', function (Blueprint $table) {
                $table->boolean('has_form')->default(0);
            });
        }

        Schema::create('user_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->enum('gender', ['Male', 'Female']);
            $table->integer('age')->nullable();
            $table->string('nationality', 100)->nullable();
            $table->string('sector')->nullable();
            $table->string('workplace', 191)->nullable();
            $table->timestamps();
        });
    }
};
