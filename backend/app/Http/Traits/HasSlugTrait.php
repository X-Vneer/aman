<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

trait HasSlugTrait
{
    protected static function bootHasSlugTrait(): void
    {
        static::creating(function (Model $model) {
            $slug = trim((string) ($model->slug ?? ''));
            if ($slug === '') {
                $model->slug = static::generateUniqueSlug($model);

                return;
            }

            $model->slug = static::ensureSlugUnique(Str::slug($slug), $model);
        });
    }

    protected static function generateUniqueSlug(Model $model): string
    {
        $source = static::resolveSlugSource($model);
        $base = Str::slug($source);
        if ($base === '') {
            $base = Str::lower(class_basename($model));
        }

        return static::ensureSlugUnique($base, $model);
    }

    protected static function ensureSlugUnique(string $base, Model $model): string
    {
        $slug = $base;
        $i = 1;
        while (static::slugTaken($slug, $model)) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    protected static function resolveSlugSource(Model $model): string
    {
        if (method_exists($model, 'getTranslation')) {
            $en = (string) $model->getTranslation('title', 'en', false);
            if ($en !== '') {
                return $en;
            }
            $ar = (string) $model->getTranslation('title', 'ar', false);
            if ($ar !== '') {
                return $ar;
            }
        }

        return (string) ($model->title_en ?? $model->title_ar ?? $model->title ?? '');
    }

    protected static function slugTaken(string $slug, Model $model): bool
    {
        $query = in_array(SoftDeletes::class, class_uses_recursive(static::class), true)
            ? static::withTrashed()
            : static::query();

        $query->where('slug', $slug);

        if ($model->exists) {
            $query->where($model->getKeyName(), '!=', $model->getKey());
        }

        return $query->exists();
    }
}
