<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Locale keys to keep. The app now supports only ar/en; everything else
     * (fr, id, and legacy ur/fil left over from earlier seed data) is stripped
     * from every spatie/laravel-translatable JSON column, plus the one
     * hand-rolled locale-keyed `settings.set_value` row (`timeout_audio`).
     */
    private const KEEP = ['ar', 'en'];

    /**
     * table => [translatable JSON columns], derived from each model's
     * `$translatable` (or `public $translatable` for Tawia).
     */
    private const TRANSLATABLE_TABLES = [
        'videos' => ['video_url', 'title', 'description'],
        'questions' => [
            'question',
            'answers_a',
            'answers_b',
            'answers_c',
            'answers_d',
            'wrong_a',
            'wrong_b',
            'wrong_c',
            'wrong_d',
            'wrong_answer_audio_urls',
            'appears_at',
        ],
        'scenes' => ['title'],
        'faqs' => ['title', 'description'],
        'blogs' => ['title', 'short_description', 'content'],
        'tawias' => ['title', 'description', 'symptoms'],
    ];

    public function up(): void
    {
        foreach (self::TRANSLATABLE_TABLES as $table => $columns) {
            $this->stripTableColumns($table, $columns);
        }

        $this->stripSettingsTimeoutAudio();
    }

    private function stripTableColumns(string $table, array $columns): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        $columns = array_values(array_filter(
            $columns,
            fn (string $column) => Schema::hasColumn($table, $column)
        ));

        if (empty($columns)) {
            return;
        }

        foreach (DB::table($table)->cursor() as $row) {
            $update = [];

            foreach ($columns as $column) {
                $raw = $row->{$column} ?? null;
                if ($raw === null || $raw === '') {
                    continue;
                }

                $decoded = json_decode($raw, true);
                if (! is_array($decoded)) {
                    // Not a locale-keyed JSON object (or malformed) — leave untouched.
                    continue;
                }

                $filtered = array_intersect_key($decoded, array_flip(self::KEEP));
                if ($filtered !== $decoded) {
                    $update[$column] = json_encode($filtered, JSON_UNESCAPED_UNICODE);
                }
            }

            if (! empty($update)) {
                DB::table($table)->where('id', $row->id)->update($update);
            }
        }
    }

    private function stripSettingsTimeoutAudio(): void
    {
        if (! Schema::hasTable('settings')) {
            return;
        }

        $row = DB::table('settings')->where('set_key', 'timeout_audio')->first();
        if (! $row || $row->set_value === null || $row->set_value === '') {
            return;
        }

        $decoded = json_decode($row->set_value, true);
        if (! is_array($decoded)) {
            return;
        }

        $filtered = array_intersect_key($decoded, array_flip(self::KEEP));
        if ($filtered !== $decoded) {
            DB::table('settings')->where('id', $row->id)->update([
                'set_value' => json_encode($filtered, JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not reversible: the dropped locale values (fr, id, ur, fil) are not
        // retained anywhere, so there is nothing to restore. Intentional no-op.
    }
};
