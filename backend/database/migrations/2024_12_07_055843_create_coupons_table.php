<?php

use App\Enums\CouponType;
use App\Enums\Lang;
use App\Models\Coupon;
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
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('code', 50)->unique();
            $table->enum('type', array_map(fn($case) => $case->value, CouponType::cases()));
            $table->decimal('amount', 8, 2)->default(0);
            $table->json('video_ids')->nullable();
            $table->json('langs')->nullable();
            $table->date('date_start');
            $table->date('date_end');
            $table->integer('max_uses')->default(0);
            $table->integer('max_customer_uses')->default(0);
            $table->integer('uses_count')->default(0);
            $table->boolean('has_form')->default(0);
            $table->decimal('paid_amount', 8, 2)->default(0);
            $table->decimal('paid_amount_after_discount', 8, 2)->default(0);

            // `status` is NOT a stored column: MySQL 8 forbids NOW() in generated columns.
            // It is computed at read time — see App\Models\Coupon::$status accessor
            // (display) and Coupon::STATUS_SQL (SQL filter + sort in Admin\CouponController).

            $table->decimal('discount_amount', 8, 2)->virtualAs('paid_amount - paid_amount_after_discount');
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            // Optimize searches by name
            $table->index(['name']);

            // Optimize lookups using code
            $table->index(['code']);

            // Optimize date range filtering
            $table->index(['date_start', 'date_end']);

            // Optimize queries tracking usage
            $table->index(['max_uses', 'uses_count']);

            // Optimize sorting/filtering by timestamps
            $table->index(['created_at']);
            $table->index(['updated_at']);
        });

        Coupon::create([
            'name'=> 'HEALTH',
            'code'=> 'HEALTH',
            'type'=> CouponType::Percentage->value,
            'amount'=> '100',
            'video_ids'=> [1,2],
            'langs'=> array_map(fn($case) => $case->value, Lang::cases()),
            'date_start'=> '2025-01-01 00:00:00',
            'date_end'=> '2025-10-01 00:00:00',
            'max_uses'=> '1000',
            'max_customer_uses'=> '4',
            'uses_count'=> '0',
            'paid_amount'=> '0',
            'paid_amount_after_discount'=> '0',
         ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
