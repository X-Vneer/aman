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
        Schema::create('payment_callback_logs', function (Blueprint $table) {
            $table->id();

            // JSON column to store the complete request data
            $table->json('request_data');

            // Individual columns for each attribute
            $table->string('action')->nullable();
            $table->string('result')->nullable();
            $table->string('status')->nullable();
            $table->string('order_id')->nullable();
            $table->string('trans_id')->nullable();
            $table->string('trans_date')->nullable();
            $table->string('amount')->nullable();
            $table->string('currency')->nullable();
            $table->string('hash')->nullable();
            $table->string('rrn')->nullable();
            $table->string('card_brand')->nullable();
            $table->string('merchant_name')->nullable();
            $table->string('transaction_identifier')->nullable();
            $table->string('processor_mid')->nullable();
            $table->string('methods')->nullable();
            $table->string('redirect_url')->nullable();
            $table->text('redirect_params')->nullable();
            $table->string('redirect_method')->nullable();
            $table->string('card')->nullable();
            $table->string('card_expiration_date')->nullable();
            $table->string('sessionId')->nullable();
            $table->text('decline_reason')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_callback_logs');
    }
};
