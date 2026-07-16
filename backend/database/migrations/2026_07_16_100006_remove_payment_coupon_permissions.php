<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('permissions')
            ->where('name', 'like', 'Coupon:%')
            ->orWhere('name', 'like', 'Financial:%')
            ->delete();
    }

    public function down(): void
    {
        // Irreversible: coupon/financial permissions removed entirely.
    }
};
