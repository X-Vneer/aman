<?php


namespace App\Http\Traits;

trait IsActiveTrait
{

    public function getIsActiveAttribute(): bool
    {
        return $this->deleted_at == null? true : false;
    }

    public function scopeIsActive($query)
    {
        return $query->where('deleted_at', null);
    }

    public function scopeIsNotActive($query)
    {
        return $query->where('deleted_at', '!=', null);
    }
}
