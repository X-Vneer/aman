<?php

use App\Enums\ContactType;
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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->enum('type', array_map(fn($case) => $case->value, ContactType::cases()));
            $table->string('name');
            $table->string('email');
            $table->string('subject');
            $table->text('message');
            $table->json('reply')->nullable();
            $table->string('status')->virtualAs(
                "case
                    when `reply` is not null then 'Responded'
                    when `reply` is null and `created_at` > current_timestamp() - interval 12 hour then 'New'
                    else 'Pending'
                end"
            );

            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            $table->index(['created_at']); // Optimize sorting/filtering by creation date
            $table->index(['updated_at']); // Optimize tracking updates

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
