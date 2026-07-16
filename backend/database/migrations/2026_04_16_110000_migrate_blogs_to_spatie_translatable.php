<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const LOCALES = ['ar', 'en', 'fr', 'fil', 'ur', 'id'];

    public function up(): void
    {
        if (! Schema::hasTable('blogs')) {
            return;
        }

        if (! Schema::hasColumn('blogs', 'title_ar')) {
            return;
        }

        Schema::table('blogs', function (Blueprint $table) {
            $table->json('title_trans')->nullable();
            $table->json('short_description_trans')->nullable();
            $table->json('content_trans')->nullable();
        });

        $empty = array_fill_keys(self::LOCALES, '');

        foreach (DB::table('blogs')->cursor() as $row) {
            $title = $empty;
            $title['ar'] = $row->title_ar ?? '';
            $title['en'] = $row->title_en ?? '';

            $short = $empty;
            $short['ar'] = $row->short_description_ar ?? '';
            $short['en'] = $row->short_description_en ?? '';

            $content = $empty;
            $content['ar'] = $row->content_ar ?? '';
            $content['en'] = $row->content_en ?? '';

            DB::table('blogs')->where('id', $row->id)->update([
                'title_trans' => json_encode($title),
                'short_description_trans' => json_encode($short),
                'content_trans' => json_encode($content),
            ]);
        }

        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn([
                'title_ar',
                'title_en',
                'short_description_ar',
                'short_description_en',
                'content_ar',
                'content_en',
            ]);
        });

        Schema::table('blogs', function (Blueprint $table) {
            $table->renameColumn('title_trans', 'title');
            $table->renameColumn('short_description_trans', 'short_description');
            $table->renameColumn('content_trans', 'content');
        });
    }

    public function down(): void
    {
        throw new \RuntimeException('This migration cannot be reversed safely; restore from backup if needed.');
    }
};
