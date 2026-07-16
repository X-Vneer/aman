<?php

use App\Enums\NotificationTitle;
use App\Enums\NotificationType;
use App\Models\AppConstants;
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

        Schema::create('notifications', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->enum('title', array_map(fn($case) => $case->value, NotificationTitle::cases()));

            $table->bigInteger('notificationable_id')->unsigned();
            $table->string('notificationable_column')->nullable();
            $table->enum('notificationable_type', array_map(fn($case) => $case->value, NotificationType::cases()));

            $table->bigInteger('user_id')->nullable()->constrained('users')->nullOnDelete()->nullOnUpdate();
            $table->bigInteger('admin_id')->nullable()->constrained('admins')->nullOnDelete()->nullOnUpdate();
            $table->json('data')->nullable();

            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->index(['title']); // Optimize searches by title
            $table->index(['created_at']); // Optimize sorting/filtering by creation date
            $table->index(['updated_at']); // Optimize queries tracking updates

        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
