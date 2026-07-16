<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('payment_callback_logs');
    }

    public function down(): void
    {
        // Irreversible: payment feature removed entirely.
    }
};
