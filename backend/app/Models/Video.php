<?php

namespace App\Models;

use App\Enums\VideoStatus;
use App\Http\Traits\HasSlugTrait;
use App\Http\Traits\Model\LogoTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Video extends Model
{
    use HasFactory, HasSlugTrait, HasTranslations, LogoTrait, SoftDeletes;

    protected static function resolveSlugSource(Model $model): string
    {
        return (string) $model->getTranslation('title', 'en', false);
    }

    protected $fillable = [
        'slug',
        'video_url',
        'logo',
        'title',
        'description',
        'color',
        'length',
        'view_counter',
        'view_complete_counter',
        'is_new',
        'status',
        'deleted_at',
    ];

    protected $casts = [
        'is_new' => 'integer',
        'status' => VideoStatus::class,
    ];

    protected $translatable = [
        'video_url',
        'title',
        'description',
    ];

    /**
     * Resolve a route parameter to a video id: match non-deleted row by `slug`, else by numeric `id`.
     */
    public static function resolveIdFromRouteParameter(mixed $raw): ?int
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        $key = (string) $raw;

        $base = static::query()->whereNull('deleted_at');

        $bySlug = (clone $base)->where('slug', $key)->value('id');
        if ($bySlug !== null) {
            return (int) $bySlug;
        }

        if (ctype_digit($key)) {
            $byId = (clone $base)->whereKey((int) $key)->value('id');

            return $byId !== null ? (int) $byId : null;
        }

        return null;
    }

    /**
     * Get the scenes associated with the Video
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function scenes(): HasMany
    {
        $locale = app()->getLocale(); // مثل ar أو en

        return $this->hasMany(Scenes::class, 'video_id', 'id')
            ->orderByRaw(
                "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(start_time, '$.\"$locale\"')), '%H:%i:%s') ASC"
            );
    }

    public function questions(): HasMany
    {
        $locale = app()->getLocale(); // مثل ar أو en

        return $this->hasMany(Question::class, 'video_id', 'id')
            ->orderByRaw(
                "STR_TO_DATE(JSON_UNQUOTE(JSON_EXTRACT(appears_at, '$.\"$locale\"')), '%H:%i:%s') ASC"
            );
    }

    public function userVideos(): HasMany
    {
        return $this->hasMany(UserVideo::class, 'video_id', 'id');
    }
}
