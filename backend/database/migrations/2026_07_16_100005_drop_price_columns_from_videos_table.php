<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the generated column first (total_discount = total_price - total_paid).
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn('total_discount');
        });

        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['price', 'total_price', 'total_paid']);
        });
    }

    public function down(): void
    {
        // Irreversible: pricing removed entirely.
    }
};
