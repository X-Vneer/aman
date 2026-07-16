<?php

use App\Models\AppConstants as GlobalAppConstants;
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
        Schema::create('request_rates', function (Blueprint $table) {
            $table->id();
            $table->string('method');
            $table->string('url');
            $table->integer('rate')->default(0);
            $table->string('ip')->nullable();
            $table->string('referrer')->nullable();
            $table->text('body')->nullable();
            $table->text('header')->nullable();

            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_rates');
    }
};
