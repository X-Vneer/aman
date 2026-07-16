<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Partner;
use App\Models\Story;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SortingTest extends TestCase
{
    use RefreshDatabase;

    protected Admin $admin;
    protected string $adminToken;

    protected array $headers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = Admin::factory()->create([
            'email' => 'sort-test@glow.net.sa',
            'password' => bcrypt('123456'),
        ]);

        $this->adminToken = $this->loginAdmin();
        $this->headers = [
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
            'Accept-Language' => 'en',
        ];
    }

    protected function loginAdmin(): string
    {
        $this->withHeaders([
            'Accept' => 'application/json',
            'Accept-Language' => 'en',
        ])->postJson(route('admin.sendotp'), [
            'email'    => 'sort-test@glow.net.sa',
            'password' => '123456',
        ])->assertStatus(200);

        $admin = Admin::where('email', 'sort-test@glow.net.sa')->first();

        $response = $this->withHeaders([
            'Accept' => 'application/json',
            'Accept-Language' => 'en',
        ])->postJson(route('admin.otpVerify'), [
            'email' => 'sort-test@glow.net.sa',
            'otp'   => $admin->otp,
        ])->assertStatus(200);

        return $response->json('data.token');
    }

    // ──────────────────────────────────────────────────────────────
    // Partners (simple model, no excluded columns)
    // ──────────────────────────────────────────────────────────────

    public function test_partners_default_sort_returns_200(): void
    {
        Partner::factory()->createMany([
            ['name' => 'Beta'],
            ['name' => 'Alpha'],
            ['name' => 'Gamma'],
        ]);

        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.partners.index'));

        $response->assertStatus(200)
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.items.meta.current_page', 1);
    }

    public function test_partners_sort_by_name_asc(): void
    {
        Partner::factory()->createMany([
            ['name' => 'Zebra'],
            ['name' => 'Apple'],
            ['name' => 'Mango'],
        ]);

        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.partners.index', [
                'sort_column'    => 'name',
                'sort_direction' => 'ASC',
            ]));

        $response->assertStatus(200);

        $names = collect($response->json('data.items.data'))->pluck('name')->toArray();
        $sorted = $names;
        sort($sorted);
        $this->assertEquals($sorted, $names, 'Partners should be sorted by name ASC');
    }

    public function test_partners_sort_by_name_desc(): void
    {
        Partner::factory()->createMany([
            ['name' => 'Zebra'],
            ['name' => 'Apple'],
            ['name' => 'Mango'],
        ]);

        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.partners.index', [
                'sort_column'    => 'name',
                'sort_direction' => 'DESC',
            ]));

        $response->assertStatus(200);

        $names = collect($response->json('data.items.data'))->pluck('name')->toArray();
        $sorted = $names;
        rsort($sorted);
        $this->assertEquals($sorted, $names, 'Partners should be sorted by name DESC');
    }

    public function test_partners_invalid_sort_column_falls_back_to_default(): void
    {
        Partner::factory()->count(3)->create();

        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.partners.index', [
                'sort_column' => 'nonexistent_column',
            ]));

        // Should not 500 — graceful fallback
        $response->assertStatus(200);
    }

    public function test_partners_invalid_sort_direction_returns_422(): void
    {
        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.partners.index', [
                'sort_column'    => 'name',
                'sort_direction' => 'INVALID',
            ]));

        // sort_direction validated via constants list_validations → 422
        $response->assertStatus(422);
    }

    // ──────────────────────────────────────────────────────────────
    // Stories (has custom filters — verify sort doesn't break them)
    // ──────────────────────────────────────────────────────────────

    public function test_stories_sort_by_first_name_asc(): void
    {
        $video = Video::factory()->create([
            'title' => ['en' => 'Test', 'ar' => 'اختبار'],
        ]);

        Story::insert([
            ['first_name' => 'Charlie', 'last_name' => 'X', 'title' => 'T', 'mobile' => '+111', 'email' => 'c@test.com', 'video_id' => $video->id, 'content' => 'c', 'created_at' => now(), 'updated_at' => now()],
            ['first_name' => 'Alice',   'last_name' => 'X', 'title' => 'T', 'mobile' => '+222', 'email' => 'a@test.com', 'video_id' => $video->id, 'content' => 'a', 'created_at' => now(), 'updated_at' => now()],
            ['first_name' => 'Bob',     'last_name' => 'X', 'title' => 'T', 'mobile' => '+333', 'email' => 'b@test.com', 'video_id' => $video->id, 'content' => 'b', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.stories.index', [
                'sort_column'    => 'first_name',
                'sort_direction' => 'ASC',
            ]));

        $response->assertStatus(200);

        $names = collect($response->json('data.items.data'))->pluck('first_name')->toArray();
        $sorted = $names;
        sort($sorted);
        $this->assertEquals($sorted, $names);
    }

    public function test_stories_sort_and_search_are_independent(): void
    {
        $video = Video::factory()->create([
            'title' => ['en' => 'Test', 'ar' => 'اختبار'],
        ]);

        Story::insert([
            ['first_name' => 'Zara', 'last_name' => 'X', 'title' => 'T', 'mobile' => '+444', 'email' => 'z@search.com', 'video_id' => $video->id, 'content' => 'z', 'created_at' => now(), 'updated_at' => now()],
            ['first_name' => 'Anna', 'last_name' => 'X', 'title' => 'T', 'mobile' => '+555', 'email' => 'a@search.com', 'video_id' => $video->id, 'content' => 'a', 'created_at' => now(), 'updated_at' => now()],
            ['first_name' => 'Other', 'last_name' => 'X', 'title' => 'T', 'mobile' => '+666', 'email' => 'other@other.com', 'video_id' => $video->id, 'content' => 'o', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Filter by email domain + sort by first_name ASC — only search.com results, sorted
        $response = $this->withHeaders($this->headers)
            ->getJson(route('admin.stories.index', [
                'email'          => 'search.com',
                'sort_column'    => 'first_name',
                'sort_direction' => 'ASC',
            ]));

        $response->assertStatus(200);

        $data = $response->json('data.items.data');

        // All results must match the search filter
        foreach ($data as $story) {
            $this->assertStringContainsString('search.com', $story['email']);
        }

        // Results must be in ASC order
        $names = collect($data)->pluck('first_name')->toArray();
        $sorted = $names;
        sort($sorted);
        $this->assertEquals($sorted, $names);
    }
}
