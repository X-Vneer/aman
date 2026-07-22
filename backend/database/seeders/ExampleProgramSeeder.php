<?php

namespace Database\Seeders;

use App\Enums\VideoStatus;
use App\Models\Question;
use App\Models\Video;
use Illuminate\Database\Seeder;

/**
 * Seeds one playable program (real Bunny HLS stream) plus 3 questions with
 * distinct, non-zero appears_at times so the in-player question modal can be
 * exercised locally.
 */
class ExampleProgramSeeder extends Seeder
{
    public function run(): void
    {
        $url = 'https://vz-5e5055f3-abf.b-cdn.net/76f6e421-07f6-4783-be8c-7944528f895e/playlist.m3u8';
        $logo = 'https://vz-5e5055f3-abf.b-cdn.net/76f6e421-07f6-4783-be8c-7944528f895e/thumbnail.jpg';

        // Start clean so re-running the seeder does not stack duplicates.
        Video::withTrashed()->where('slug', 'test-program')->get()->each(function (Video $v) {
            $v->questions()->forceDelete();
            $v->forceDelete();
        });

        $video = Video::create([
            'video_url' => ['ar' => $url, 'en' => $url],
            'logo' => $logo,
            'title' => ['ar' => 'برنامج تجريبي', 'en' => 'Test Program'],
            'description' => ['ar' => 'برنامج تجريبي.', 'en' => 'This is a test program.'],
            'length' => '00:01:30',
            'color' => '#7369ff',
            'view_counter' => 0,
            'view_complete_counter' => 0,
            'is_new' => 1,
            'status' => VideoStatus::Approved,
        ]);

        $emptyAudio = [
            'ar' => ['answer_a' => '', 'answer_b' => '', 'answer_c' => ''],
            'en' => ['answer_a' => '', 'answer_b' => '', 'answer_c' => ''],
        ];

        $questions = [
            ['at' => '00:00:10', 'n' => 1],
            ['at' => '00:00:20', 'n' => 2],
            ['at' => '00:00:30', 'n' => 3],
        ];

        foreach ($questions as $q) {
            $n = $q['n'];
            Question::create([
                'video_id' => $video->id,
                'question' => ['ar' => "سؤال رقم {$n}؟", 'en' => "Question number {$n}?"],
                'answers_a' => ['ar' => "الإجابة أ للسؤال $n", 'en' => "Answer A for Q$n"],
                'answers_b' => ['ar' => "الإجابة ب للسؤال $n", 'en' => "Answer B for Q$n"],
                'answers_c' => ['ar' => "الإجابة ج للسؤال $n", 'en' => "Answer C for Q$n"],
                'wrong_a' => ['ar' => '', 'en' => ''],
                'wrong_b' => ['ar' => "لأن ب غير صحيحة للسؤال $n", 'en' => "Because B is wrong for Q$n"],
                'wrong_c' => ['ar' => "لأن ج غير صحيحة للسؤال $n", 'en' => "Because C is wrong for Q$n"],
                'correct_answer' => 'answer_a',
                'allowed_time' => '00:00:30',
                'appears_at' => ['ar' => $q['at'], 'en' => $q['at']],
                'wrong_answer_audio_urls' => $emptyAudio,
            ]);
        }

        $this->command->info("Seeded program #{$video->id} '{$video->slug}' with 3 questions at 00:00:10 / 20 / 30.");
    }
}
