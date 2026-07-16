<?php


namespace App\Services;

use App\Http\Resources\AdminResource; 
use App\Http\Resources\UserResource;
use App\Models\Admin; 
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{ 
    public $table;
    public $primaryKey;
    public $model;
    public $resource;
    public $id;
    public $guard;

    function __construct()
    {
        if(auth('admin')->check()){
            $this->table = 'admins';
            $this->primaryKey = 'id';
            $this->model = Admin::class;
            $this->resource = AdminResource::class;
            $this->id = Auth::user()->id;
            $this->guard = 'admin';
        } 

        if(auth('user')->check()){
            $this->table = 'users';
            $this->primaryKey = 'id';
            $this->model = User::class;
            $this->resource = UserResource::class;
            $this->id = Auth::user()->id;
            $this->guard = 'user';
        }
    }
}
