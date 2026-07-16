<?php

use App\Models\Admin;
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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('otp', 4)->nullable();
            $table->timestamp('otp_created_at')->nullable();
            $table->string('name', 50)->nullable();
            $table->string('mobile')->nullable();
            $table->string('email')->nullable();
            $table->string('role_name')->nullable();
            $table->string('password', 191);
            $table->timestamp('deleted_at')->nullable();
            $table->bigInteger('last_read_notification_id')->default(0);

            $table->timestamps();

            $table->index(['email']); // Fast lookup for users by email
            $table->index(['otp']); // Quick OTP verification
            $table->index(['otp_created_at']); // Optimize OTP expiration queries
            $table->index(['created_at']); // Optimize sorting/filtering by creation date
            $table->index(['updated_at']); // Optimize tracking updates
            $table->index(['last_read_notification_id']); // Optimize notification tracking

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
