<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Video>
 */
class VideoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'video_url' => [
                'en' => $this->faker->url(),
                'ar' => $this->faker->url(),
            ],
            'logo' => $this->faker->imageUrl(),
            'title' => [
                'en' => $this->faker->sentence(3),
                'ar' => $this->faker->sentence(3),
            ],
            'description' => [
                'en' => $this->faker->paragraph(),
                'ar' => $this->faker->paragraph(),
            ],
            'length' => $this->faker->time('H:i:s'),
            'color' => $this->faker->hexColor(),
            'view_counter' => 0,
            'view_complete_counter' => 0,
        ];
    }
}
