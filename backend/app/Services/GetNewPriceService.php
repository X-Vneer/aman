<?php

namespace App\Services;

use App\Enums\CouponType;
use App\Enums\CouponTypeStatus;
use App\Enums\VideoPaymentStatus;
use App\Models\Coupon;
use App\Models\UserVideo;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;

class GetNewPriceService
{
    public float $price = 0;
    private ?Video $video = null;
    private ?Coupon $coupon = null;
    private ?UserVideo $userVideo = null;
    public ?string $coupon_code = null;

    /**
     * Constructor
     *
     * @param int $video_id
     * @param string $coupon_code
     */
    public function __construct(int $video_id, string|null $coupon_code)
    {
        $this->loadVideo($video_id);
        $this->loadCoupon($coupon_code);
        $this->coupon_code = $coupon_code;

        if (!$this->video) {
            $this->price = 0;
            return;
        }

        $this->price = (float) $this->video->price;

        if (!$this->isValidCoupon($video_id)) {
            return;
        }

        if ($this->shouldReturnOriginalPrice()) {
            return;
        }

        // Check coupon usage limits
        if (!$this->isCouponUsageValid()) {
            return;
        }

        $this->coupon_code = null;

        $this->applyDiscount();
    }

    /**
     * Load the video model
     *
     * @param int $video_id
     * @return void
     */
    private function loadVideo(int $video_id): void
    {
        $this->video = Video::find($video_id);
    }

    /**
     * Load the coupon model
     *
     * @param string $coupon_code
     * @return void
     */
    private function loadCoupon(string|null $coupon_code): void
    {
        $this->coupon = Coupon::whereRaw('('.Coupon::STATUS_SQL.') = ?', [CouponTypeStatus::Active->value])
            ->where('code', $coupon_code)
            ->first();
    }

    /**
     * Check if the coupon is valid for the video
     *
     * @param int $video_id
     * @return bool
     */
    private function isValidCoupon(int $video_id): bool
    {
        return $this->coupon && in_array($video_id, $this->coupon->video_ids ?? []);
    }

    /**
     * Check if we should return the original price
     *
     * @return bool
     */
    private function shouldReturnOriginalPrice(): bool
    {
        if (!$this->coupon) {
            return true;
        }

        // For fixed discount, if video price is less than coupon amount, return original price
        if ($this->coupon->type == CouponType::Fixed->value) {
            return $this->video->price < $this->coupon->amount;
        }

        return false;
    }

    /**
     * Check if coupon usage is valid for the current user
     *
     * @return bool
     */
    private function isCouponUsageValid(): bool
    {
        if (!$this->coupon) {
            return false;
        }

        $currentUser = Auth::user();
        if (!$currentUser) {
            return false;
        }

        // Check total coupon usage (max_uses)
        if ($this->coupon->max_uses) {
            $totalUsage = UserVideo::where('coupon_id', $this->coupon->id)->whereIn('status', [VideoPaymentStatus::Accepted->value, VideoPaymentStatus::UnderReview->value])->count();
            if ($totalUsage >= $this->coupon->max_uses) {
                return false;
            }
        }

        // Check current user's coupon usage (max_customer_uses)
        if ($this->coupon->max_customer_uses) {
            $userUsage = UserVideo::where('coupon_id', $this->coupon->id)
                ->where('user_id', $currentUser->id)
                ->whereIn('status', [VideoPaymentStatus::Accepted->value, VideoPaymentStatus::UnderReview->value])
                ->count();
            if ($userUsage >= $this->coupon->max_customer_uses) {
                return false;
            }
        }

        return true;
    }

    /**
     * Apply discount to the price
     *
     * @return void
     */
    private function applyDiscount(): void
    {
        $discount = $this->calculateDiscount();
        $this->price = $this->price - $discount;
    }

    /**
     * Calculate the discount amount
     *
     * @return float
     */
    private function calculateDiscount(): float
    {
        if ($this->coupon->type == CouponType::Fixed->value) {
            return (float) $this->coupon->amount;
        } else {
            return (float) $this->coupon->amount / 100 * $this->price;
        }
    }
}
