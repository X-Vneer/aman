<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'gender',
        'age',
        'nationality',
        'sector',
        'workplace'
    ];


    /**
     * Get the user that owns the info.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
 

    /**
     * Get the gender in Arabic.
     */
    public function getGenderInArabicAttribute()
    {
        return match($this->gender) {
            'Male' => 'ذكر',
            'Female' => 'أنثى',
            default => $this->gender,
        };
    }
}
