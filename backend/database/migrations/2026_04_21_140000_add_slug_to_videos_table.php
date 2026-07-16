<?php

use App\Models\Video;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('videos') || Schema::hasColumn('videos', 'slug')) {
            return;
        }

        Schema::table('videos', function (Blueprint $table) {
            $table->string('slug', 191)->nullable()->unique()->after('id');
        });

        Video::query()->orderBy('id')->chunkById(100, function ($videos) {
            foreach ($videos as $video) {
                /** @var Video $video */
                $source = (string) $video->getTranslation('title', 'en');
                if ($source === '') {
                    $source = 'video-'.$video->getKey();
                }
                $base = Str::slug($source) ?: ('video-'.$video->getKey());
                $slug = $this->uniqueSlug('videos', $base, (int) $video->getKey());
                DB::table('videos')->where('id', $video->getKey())->update(['slug' => $slug]);
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('videos') || ! Schema::hasColumn('videos', 'slug')) {
            return;
        }

        Schema::table('videos', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
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
