<?php

namespace Database\Factories;

use App\Enums\CouponType;
use App\Enums\Lang;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [ 
            'name' => $this->faker->unique()->sentence(2, true), 
            'code' => strtoupper(Str::random(10)), 
            'type' => $this->faker->randomElement(array_map(fn($case) => $case->value, CouponType::cases())),
            'amount' => $this->faker->numberBetween(1, 20),
            'video_ids' => $this->faker->randomElements([1, 2], rand(1,2)),
            'langs' => $this->faker->randomElements(array_map(fn($case) => $case->value, Lang::cases()), rand(1,5)),
            'date_start' => $this->faker->dateTimeBetween('-1 day', '+3 day')->format('Y-m-d\TH:i:s.v\Z'),
            'date_end' => $this->faker->dateTimeBetween('+1 month', '+2 months')->format('Y-m-d\TH:i:s.v\Z'),
            'max_uses' => $this->faker->numberBetween(1, 100),
            'max_customer_uses' => $this->faker->numberBetween(1, 3),
            'deleted_at' => $this->faker->randomElement([NULL, '2024-12-08', '2024-12-07']),
        ];
    }
}
