<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Story;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoriesTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $story;
    protected $video;
    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        // Create admin user
        $this->admin = Admin::factory()->create([
            'email' => 'info@glow.net.sa',
            'password' => bcrypt('123456'),
        ]);

        // Create a video for testing
        $this->video = Video::factory()->create([
            'title' => ['en' => 'Test Video', 'ar' => 'فيديو تجريبي'],
            'price' => 100,
        ]);

        // Create a sample story
        $this->story = Story::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'title' => 'My Success Story',
            'mobile' => '+1234567890',
            'email' => 'john.doe@example.com',
            'video_id' => $this->video->id,
            'content' => 'This is a sample success story content.',
        ]);

        // Login and get token
        $this->adminToken = $this->loginAdmin();
    }

    protected function loginAdmin(): string
    {
        // Send OTP
        $response = $this->withHeaders([
            'Accept-Language' => 'en',
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->postJson(route('admin.sendotp'), [
            'email' => 'info@glow.net.sa',
            'password' => '123456'
        ]);
        $response->assertStatus(200);

        // Verify OTP
        $admin = Admin::where('email', 'info@glow.net.sa')->first();
        $response = $this->withHeaders([
            'Accept-Language' => 'en',
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->postJson(route('admin.otpVerify'), [
            'email' => 'info@glow.net.sa',
            'otp' => $admin->otp
        ]);
        $response->assertStatus(200);

        return $response->json('data.token');
    }

    public function test_admin_can_list_stories()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.index'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'items' => [
                        'data' => [
                            '*' => [
                                'id',
                                'first_name',
                                'last_name',
                                'full_name',
                                'title',
                                'mobile',
                                'email',
                                'video_id',
                                'locale',
                                'content',
                                'created_at',
                                'updated_at',
                                'deleted_at'
                            ]
                        ]
                    ]
                ]
            ]);
    }

    public function test_admin_can_create_story()
    {
        $storyData = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'title' => 'Another Success Story',
            'mobile' => '+0987654321',
            'email' => 'jane.smith@example.com',
            'video_id' => $this->video->id,
            'content' => 'This is another success story content.',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->postJson(route('admin.stories.store'), $storyData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                                            'item' => [
                            'id',
                            'first_name',
                            'last_name',
                            'full_name',
                            'title',
                            'mobile',
                            'email',
                            'video_id',
                            'locale',
                            'content',
                            'created_at',
                            'updated_at',
                            'deleted_at'
                        ]
                ]
            ]);

        $this->assertDatabaseHas('stories', [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane.smith@example.com',
            'locale' => 'en', // Should be automatically set to current locale
        ]);
    }

    public function test_admin_can_show_story()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.show', $this->story->id));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'item' => [
                        'id',
                        'first_name',
                        'last_name',
                        'full_name',
                        'title',
                        'mobile',
                        'email',
                        'video_id',
                        'content',
                        'created_at',
                        'updated_at',
                        'deleted_at'
                    ]
                ]
            ]);
    }

    public function test_admin_can_update_story()
    {
        $updateData = [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'title' => 'Updated Story Title',
            'mobile' => '+1111111111',
            'email' => 'updated@example.com',
            'video_id' => $this->video->id,
            'content' => 'Updated content for the story.',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->putJson(route('admin.stories.update', $this->story->id), $updateData);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'item' => [
                        'id',
                        'first_name',
                        'last_name',
                        'full_name',
                        'title',
                        'mobile',
                        'email',
                        'video_id',
                        'content',
                        'created_at',
                        'updated_at',
                        'deleted_at'
                    ]
                ]
            ]);

        $this->assertDatabaseHas('stories', [
            'id' => $this->story->id,
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_admin_can_delete_story()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->deleteJson(route('admin.stories.destroy', $this->story->id));

        $response->assertStatus(200);

        $this->assertSoftDeleted('stories', [
            'id' => $this->story->id,
        ]);
    }

    public function test_admin_can_toggle_story_active_state()
    {
        // Test deactivating (soft delete)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->putJson(route('admin.stories.toggleActive', [$this->story->id, 'false']));

        $response->assertStatus(200);

        $this->assertSoftDeleted('stories', [
            'id' => $this->story->id,
        ]);

        // Test reactivating (restore)
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->putJson(route('admin.stories.toggleActive', [$this->story->id, 'true']));

        $response->assertStatus(200);

        $this->assertDatabaseHas('stories', [
            'id' => $this->story->id,
            'deleted_at' => null,
        ]);
    }

    public function test_admin_can_filter_stories_by_video_id()
    {
        // Create another story with different video
        $video2 = Video::factory()->create();
        Story::create([
            'first_name' => 'Alice',
            'last_name' => 'Johnson',
            'title' => 'Different Video Story',
            'mobile' => '+2222222222',
            'email' => 'alice@example.com',
            'video_id' => $video2->id,
            'content' => 'Story for different video.',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.index', ['video_id' => $this->video->id]));

        $response->assertStatus(200);

        $stories = $response->json('data.items.data');
        foreach ($stories as $story) {
            $this->assertEquals($this->video->id, $story['video_id']);
        }
    }

    public function test_admin_can_search_stories_by_email()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.index', ['email' => 'john.doe@example.com']));

        $response->assertStatus(200);

        $stories = $response->json('data.items.data');
        $this->assertNotEmpty($stories);
        $this->assertStringContainsString('john.doe@example.com', $stories[0]['email']);
    }

    public function test_admin_can_search_stories_by_mobile()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.index', ['mobile' => '+1234567890']));

        $response->assertStatus(200);

        $stories = $response->json('data.items.data');
        $this->assertNotEmpty($stories);
        $this->assertStringContainsString('+1234567890', $stories[0]['mobile']);
    }

    public function test_admin_can_get_create_form_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.create'));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'videos' => [
                        '*' => [
                            'id',
                            'title'
                        ]
                    ]
                ]
            ]);
    }

    public function test_admin_can_get_edit_form_data()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.edit', $this->story->id));

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'item' => [
                        'id',
                        'first_name',
                        'last_name',
                        'full_name',
                        'title',
                        'mobile',
                        'email',
                        'video_id',
                        'content',
                        'created_at',
                        'updated_at',
                        'deleted_at'
                    ]
                ]
            ]);
    }

    public function test_story_has_virtual_full_name_column()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->getJson(route('admin.stories.show', $this->story->id));

        $response->assertStatus(200);

        $story = $response->json('data.item');
        $this->assertEquals('John Doe', $story['full_name']);
    }

    public function test_story_locale_is_automatically_set_on_creation()
    {
        $storyData = [
            'first_name' => 'Test',
            'last_name' => 'User',
            'title' => 'Test Story',
            'mobile' => '+1234567890',
            'email' => 'test@example.com',
            'age' => 25,
            'content' => 'Test content',
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'Accept-Language' => 'en',
        ])->postJson(route('admin.stories.store'), $storyData);

        $response->assertStatus(201);

        // Verify that locale was automatically set to current app locale
        $this->assertDatabaseHas('stories', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'locale' => 'en', // Should be automatically set to current locale
        ]);

        $story = $response->json('data.item');
        $this->assertEquals('en', $story['locale']);
    }
}
