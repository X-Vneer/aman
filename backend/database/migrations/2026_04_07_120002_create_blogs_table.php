<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title_ar', 191);
            $table->string('title_en', 191);
            $table->text('short_description_ar');
            $table->text('short_description_en');
            $table->longText('content_ar');
            $table->longText('content_en');
            $table->date('publish_date');
            $table->string('logo', 191)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
