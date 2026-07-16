<?php

namespace App\Models;

use App\Enums\NotificationTitle;
use App\Enums\NotificationType;
use App\Enums\VideoPaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class UserVideo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', // ID of the user
        'video_id', // ID of the video
        'answer_average', // Average score of answers
        'hearts', // Number of hearts/likes (default: 5)
        'total_questions', // Total number of questions (default: 0)
        'correct_answers', // Number of correct answers (default: 0)
        'progress', // Progress percentage (default: 0)
        'lang', // Language of the video (default: Lang::ar)
        'current_time', // Current playback time (default: 00:00:00)
        'last_question_id', // ID of the last answered question

        'view_counter', // Number of views (default: 0)
        'view_complete_counter', // Number of completed views (default: 0)
        'is_rated', // Whether the video is rated (default: false)

        'status', // Enrollment status (free + instant = Accepted)

        'certificate_url', // URL of the certificate
        'certificate_qr_code', // QR code of the certificate
        'certificate_number', // Certificate number
        'is_certificate_generated', // Whether the certificate is generated (default: false)
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {
             $notification = Notification::create([
                'title' => NotificationTitle::Payment->value,
                'notificationable_id' => $model->id,
                'notificationable_column' => 'id',
                'notificationable_type' => NotificationType::UserVideo->value,
                'user_id' => auth()->user()?->id,
                'admin_id' => null
             ]);
        });
    }

    /**
     * Get the video associated with the UserVideo
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */

    function getEvaluationAttribute() {
        if(!$this->certificate_number) return null;
        return evaluateMark($this->total_questions, $this->correct_answers);
    }

    public function video(): HasOne
    {
        return $this->hasOne(Video::class, 'id', 'video_id')->withTrashed();
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->withTrashed();
    }

    public function answers(): HasMany
    {
        return $this->hasMany(UserAnswer::class, 'user_video_id', 'id')->where('user_id', Auth::id());
    }

    public function scenes(): HasMany
    {
        $locale = app()->getLocale(); // مثل ar أو en

        return $this->hasMany(Scenes::class, 'video_id', 'video_id')
        ->orderByRaw(
            "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(start_time, '$.\"$locale\"')), '%H:%i:%s') ASC"
        );
    }

    public function questions(): HasMany
    {
        $locale = app()->getLocale(); // مثل ar أو en
        return $this->hasMany(Question::class, 'video_id', 'video_id')
        ->orderByRaw(
            "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(appears_at, '$.\"$locale\"')), '%H:%i:%s') ASC"
        );
    }

    /**
     * Scope a query to only include records with null certificate_url.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRegistered($query)
    {
        return $query->where('status', VideoPaymentStatus::Accepted->value)->where('is_certificate_generated', 0);
    }


    //scope is applicable for certificate
    public function scopeIsApplicableForCertificate($query)
    {
        return $query
            ->where('progress', '>=', 99)
            ->where('is_rated', 1);
    }

    public function isApplicableForCertificate(): bool
    {
        if ((int) $this->progress < 99) return false;
        if ((int) $this->is_rated !== 1) return false;

        return true;
    }

    /**
     * Admin dashboard: certificate pipeline phases (aligned with certificate PDF checks and lang/certificate.php copy:
     * must_watch ≈ phase 1, must_set_full_name ≈ phase 3 full_name; phase 4 is retained for shape compatibility
     * and always complete since the user-info form feature was removed).
     *
     * @return array{
     *   phase_1_completed: bool,
     *   phase_2_completed: bool,
     *   phase_3_completed: bool,
     *   phase_4_completed: bool,
     *   phase_5_completed: bool,
     *   current_phase: int|null,
     *   can_revoke_certificate_generation: bool
     * }
     */
    public function certificateProgressPhases(): array
    {
        $user = $this->relationLoaded('user') ? $this->user : $this->user()->first();

        $phase1 = (int) $this->progress >= 99;
        $phase2 = (int) $this->is_rated === 1;
        $phase3 = $this->userHasBasicProfileForCertificate($user);
        $phase4 = true;
        $phase5 = (int) $this->is_certificate_generated === 1;

        $steps = [
            1 => $phase1,
            2 => $phase2,
            3 => $phase3,
            4 => $phase4,
            5 => $phase5,
        ];

        $currentPhase = null;
        foreach ($steps as $index => $done) {
            if (! $done) {
                $currentPhase = $index;
                break;
            }
        }

        $canRevoke = $phase5 && ! ($phase1 && $phase2 && $phase3 && $phase4);

        return [
            'phase_1_completed' => $phase1,
            'phase_2_completed' => $phase2,
            'phase_3_completed' => $phase3,
            'phase_4_completed' => $phase4,
            'phase_5_completed' => $phase5,
            'current_phase' => $currentPhase,
            'can_revoke_certificate_generation' => $canRevoke,
        ];
    }

    /**
     * Phase 3: profile full name required (same as UserVideoController::downloadCertificateAsPdf and certificate.must_set_full_name).
     */
    protected function userHasBasicProfileForCertificate(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        return trim((string) ($user->full_name ?? '')) !== '';
    }

    public function allCertificatePhasesCompleted(): bool
    {
        $p = $this->certificateProgressPhases();

        return $p['phase_1_completed']
            && $p['phase_2_completed']
            && $p['phase_3_completed']
            && $p['phase_4_completed']
            && $p['phase_5_completed'];
    }
}
