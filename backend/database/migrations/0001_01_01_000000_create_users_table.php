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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', 20);
            $table->string('otp', 4)->nullable();
            $table->timestamp('otp_created_at')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('full_name')->virtualAs('CONCAT(first_name, " ", last_name)');
            $table->string('lang', 5)->default('en');
            $table->integer('certificate_count')->default('0');
            $table->string('email', 60)->nullable()->unique();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            $table->index(['mobile']); // Index for quick lookup by mobile
            $table->index(['otp']); // Index for quick OTP verification
            $table->index(['otp_created_at']); // Index for OTP expiration checks
            $table->index(['created_at']); // Index for sorting by creation date
            $table->index(['updated_at']); // Index for tracking updates
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
