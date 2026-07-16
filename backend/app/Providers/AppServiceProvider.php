<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Carbon::serializeUsing(function ($carbon) {
            return $carbon->setTimezone('UTC')->toISOString(); // "2026-04-22T11:14:35.000000Z"
        });


        if ($this->app->environment('local') || $this->app->environment('production') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        // Model::preventLazyLoading(true);

        Validator::extend('sa_mobile', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^(970|\+970|0)?5[0-9]{8}$/', $value);
        });

        Validator::extend('time_format', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/', $value);
        });
        Validator::replacer('time_format', function ($message, $attribute, $rule, $parameters) {
            return trans('time format must be in hh:mm:ss as 00:00:00');
        });

        Validator::replacer('sa_mobile', function ($message, $attribute, $rule, $parameters) {
            return trans('mobileIsNotAValidSaudiArabiaMobileNumber');
        });




        Builder::macro('betweenEqual', function ($field, $array) {
            return $this->where($field, '>=', $array[0])
                ->where($field, '<=', $array[1]);
        });

        Builder::macro('like', function ($field, $string) {
            return $string ? $this->where($field, 'like', '%' . $string . '%') : $this;
        });

        Builder::macro('likeEnd', function ($field, $string) {
            return $string ? $this->where($field, 'like', '%' . $string) : $this;
        });

        Builder::macro('likeStart', function ($field, $string) {
            return $string ? $this->where($field,  'like', $string . '%') : $this;
        });
        Builder::macro('orLikeEnd', function ($field, $string) {
            return $string ? $this->orWhere($field, 'like', '%' . $string) : $this;
        });

        Builder::macro('orLikeStart', function ($field, $string) {
            return $string ? $this->orWhere($field,  'like', $string . '%') : $this;
        });

        Builder::macro('orLike', function ($field, $string) {
            return $string ? $this->orWhere($field, 'like', '%' . $string . '%') : $this;
        });

        Builder::macro('active', function () {
            return $this->whereNull('deleted_at');
        });

        Builder::macro('inActive', function () {
            return $this->whereNotNull('deleted_at');
        });
    }
}
