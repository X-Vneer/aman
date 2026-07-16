<?php

use App\Enums\Lang;
use App\Enums\VideoPaymentStatus;
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
        Schema::create('user_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('video_id')->constrained('videos')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('transaction_id')->nullable();
            $table->string('answer_average')->nullable();
            $table->tinyInteger('hearts')->default(5)->unsigned();
            $table->integer('total_questions')->default(0)->unsigned();
            $table->integer('correct_answers')->default(0)->unsigned();
            $table->integer('progress')->default(0)->unsigned();
            $table->enum('lang', array_map(fn($case) => $case->value, Lang::cases()))->default(Lang::ar->value);
            $table->string('current_time')->default('00:00:00');
            $table->foreignId('last_question_id')->on('questions')->nullable();
            $table->integer('view_counter')->default(0);
            $table->integer('view_complete_counter')->default(0);
            $table->boolean('is_rated')->default(0);
            $table->decimal('price_original', 10, 5)->comment('price without tax_value');
            $table->decimal('price', 8, 2)->comment('price including tax_value without discount as  = price + tax_value');
            $table->decimal('tax_value', 10, 5)->default(0)->comment('tax value after discount');
            $table->foreignId('coupon_id')->on('coupons')->nullable();
            $table->string('coupon_code', 50)->nullable();
            $table->boolean('has_form')->default(0);
            $table->decimal('discount_value', 8, 2)->default(0);
            $table->decimal('final_price', 8, 2)->virtualAs("price - discount_value")->comment('final price after discount and tax');
            $table->decimal('paid', 8, 2)->default(0)->comment('paid amount after discount and tax');
            $table->decimal('outstanding_payment', 8, 2)->virtualAs("price - discount_value - paid");
            $table->enum('status', array_map(fn($case) => $case->value, VideoPaymentStatus::cases()))->default(VideoPaymentStatus::UnderReview->value);

            $table->string('certificate_url')->nullable();
            $table->string('certificate_qr_code')->nullable();
            $table->string('certificate_number')->nullable();
            $table->boolean('is_certificate_generated')->default(0);
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            // Optimize searches by rating status
            $table->index(['is_rated']);

            // Optimize searches using coupon codes
            $table->index(['coupon_code']);

            // Optimize filtering by status
            $table->index(['status']);

            // Optimize queries involving certificates (limit index length if needed)
            $table->index(['certificate_url']); // MySQL: Index only first 100 characters

            // Optimize sorting/filtering by timestamps
            $table->index(['created_at']);
            $table->index(['updated_at']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_videos');
    }
};
