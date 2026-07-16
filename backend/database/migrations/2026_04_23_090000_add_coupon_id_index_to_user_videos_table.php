<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_videos', function (Blueprint $table) {
            $table->index('coupon_id', 'user_videos_coupon_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('user_videos', function (Blueprint $table) {
            $table->dropIndex('user_videos_coupon_id_index');
        });
    }
};
