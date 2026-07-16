<?php

namespace Database\Factories;

use App\Models\Story;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Story>
 */
class StoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'title' => $this->faker->sentence(3),
            'mobile' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->safeEmail(),
            'age' => $this->faker->numberBetween(18, 120),
            'video_id' => Video::factory(),
            'locale' => $this->faker->randomElement(['en', 'ar', 'fr', 'id']),
            'content' => $this->faker->paragraphs(3, true),
            'program_name' => $this->faker->firstName(),
        ];
    }
}
