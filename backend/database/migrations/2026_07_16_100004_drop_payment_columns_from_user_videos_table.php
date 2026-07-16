<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Drop generated (virtual) columns first — they depend on the base
        //    columns removed below (final_price = price - discount_value,
        //    outstanding_payment = price - discount_value - paid).
        Schema::table('user_videos', function (Blueprint $table) {
            $table->dropColumn(['final_price', 'outstanding_payment']);
        });

        // 2) Drop indexes on coupon columns before dropping their base columns.
        Schema::table('user_videos', function (Blueprint $table) {
            $table->dropIndex('user_videos_coupon_id_index');
            $table->dropIndex('user_videos_coupon_code_index');
        });

        // 3) Drop the remaining payment/coupon base columns.
        Schema::table('user_videos', function (Blueprint $table) {
            $table->dropColumn([
                'transaction_id',
                'price_original',
                'price',
                'tax_value',
                'coupon_id',
                'coupon_code',
                'discount_value',
                'paid',
            ]);
        });
    }

    public function down(): void
    {
        // Irreversible: payment/coupon feature removed entirely.
    }
};
