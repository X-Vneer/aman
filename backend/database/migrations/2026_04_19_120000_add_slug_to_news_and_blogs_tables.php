<?php

use App\Models\Blog;
use App\Models\News;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([Blog::class, News::class] as $modelClass) {
            /** @var Blog|News $sample */
            $sample = new $modelClass;
            $table = $sample->getTable();

            if (! Schema::hasTable($table) || Schema::hasColumn($table, 'slug')) {
                continue;
            }

            Schema::table($table, function (Blueprint $t) {
                $t->string('slug', 191)->nullable()->unique()->after('id');
            });

            $modelClass::query()->orderBy($sample->getKeyName())->chunkById(100, function ($items) use ($table) {
                foreach ($items as $model) {
                    /** @var Blog|News $model */
                    $source = (string) $model->getTranslation('title', 'en');
                    if ($source === '') {
                        $source = 'item-'.$model->getKey();
                    }
                    $base = Str::slug($source) ?: ('item-'.$model->getKey());
                    $slug = $this->uniqueSlug($table, $base, (int) $model->getKey());
                    DB::table($table)->where($model->getKeyName(), $model->getKey())->update(['slug' => $slug]);
                }
            });
        }
    }

    public function down(): void
    {
        foreach ([Blog::class, News::class] as $modelClass) {
            $sample = new $modelClass;
            $table = $sample->getTable();

            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'slug')) {
                continue;
            }

            Schema::table($table, function (Blueprint $t) use ($table) {
                $t->dropUnique($table.'_slug_unique');
                $t->dropColumn('slug');
            });
        }
    }

    private function uniqueSlug(string $table, string $base, int $id): string
    {
        $slug = $base;
        $i = 1;
        while (DB::table($table)->where('slug', $slug)->where('id', '!=', $id)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }
};
