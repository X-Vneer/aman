<?php

namespace App\Models;

use App\Http\Traits\HasSlugTrait;
use App\Http\Traits\IsActiveTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class News extends Model
{
    use HasFactory, HasSlugTrait, HasTranslations, IsActiveTrait, SoftDeletes;

    protected static function resolveSlugSource(Model $model): string
    {
        return (string) $model->getTranslation('title', 'en', false);
    }

    protected $fillable = [
        'slug',
        'title',
        'short_description',
        'content',
        'publish_date',
        'logo',
        'deleted_at',
    ];

    protected $casts = [
        'publish_date' => 'date',
    ];

    protected $translatable = [
        'title',
        'short_description',
        'content',
    ];

    protected $appends = [
        'is_active',
    ];

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
