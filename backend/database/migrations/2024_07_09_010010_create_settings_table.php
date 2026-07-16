<?php

use App\Models\Setting;
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
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('set_key',50);
            $table->longText('set_value');
            $table->string('type')->nullable();
            $table->string('description')->nullable();

            $table->timestamp('deleted_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();

            $table->index(['set_key']);

        });


        Setting::create([
            'set_key' => 'timeout_audio',
            'set_value' => json_encode([
                "ar" => env("AMAN_API") . "timeout/ar.mp3",
                "en" => env("AMAN_API") . "timeout/en.mp3",
                "fr" => env("AMAN_API") . "timeout/fr.mp3",
                "ur" => env("AMAN_API") . "timeout/ur.mp3",
                "fil" => env("AMAN_API") . "timeout/fil.mp3",
                "id" => env("AMAN_API") . "timeout/id.mp3",
            ], JSON_UNESCAPED_UNICODE),
            'type' => 'text',
            'description' => 'video time out audio relative url',
        ]);

        Setting::create([
            'set_key' => 'tax',
            'set_value' =>  15,
            'type' => 'number',
            'description' => 'tax',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
