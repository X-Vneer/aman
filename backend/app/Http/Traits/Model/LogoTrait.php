<?php


namespace App\Http\Traits\Model;
   

trait LogoTrait
{
    public function getLogoAttribute($value)
    {
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return $value;
        } 
        return $value ? asset('storage/' . $value) : '';
    }
   
    public function setLogoAttribute($value)
    {
        $this->attributes['logo'] = getRelative($value);
    }
}
