<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\Coupon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AppTest extends TestCase
{
    private string|null $userToken = null;
    private string|null $adminToken = null;

    private $header = [ 
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
        'Accept-Language' => 'en',
    ];

    function test_crud($resource = null, $token = null,  $id = null, $routes = ['index', 'edit', 'show', 'create', 'store', 'update', 'destroy', 'toggleActive'], $body = []) {
        if(!$resource) return; 
        $header = [
            'Authorization' => 'Bearer ' . $token,
            ...$this->header
        ];
   
        if(in_array('store', $routes)){
            $response = $this->postJson(route("$resource.store"), $body, $header);
            $response->assertStatus(201);  
            $response->assertJson([
                'status' => true,
            ]);
            $id= $response->json('data.item.id');
            $this->assertNotNull($id);
            
        }

        if(in_array('index', $routes)){
            $response = $this->getJson(route("$resource.index"), $header);
            $response->assertStatus(200);  
            $response->assertJson(['status' => true ]);
            $this->assertNotNull($response->json('data.items.meta'));
        }

        if(in_array('show', $routes)){
            $response = $this->getJson(route("$resource.show", $id), $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
        }
        
        if(in_array('edit', $routes)){
            $response = $this->getJson(route("$resource.edit", $id), $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
        }
        
        if(in_array('update', $routes)){ 
            $response = $this->putJson(route("$resource.update", $id), $body, $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
        }
        
        if(in_array('toggleActive', $routes)){
            $response = $this->putJson(route("$resource.toggleActive",[ $id, 'true']), [], $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
            $response = $this->putJson(route("$resource.toggleActive", [$id, 'false']), [], $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
            $response = $this->putJson(route("$resource.toggleActive",[ $id, 'true']), [], $header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]);
        }
        
        if(in_array('destroy', $routes)){
            $response = $this->deleteJson(route("$resource.destroy", $id), [], $this->header);
            $response->assertStatus(200);  
            $response->assertJson([
                'status' => true,
            ]); 
        }

        
    }

    public function test_migrate_fresh(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
        Artisan::call('migrate:fresh');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');

        
        Artisan::call('db:seed');
        $this->assertTrue(true);
    }

    public function test_admin_Send_request_otp_and_login($email = 'info@glow.net.sa', $password = '123456'): string
    { 
        $response = $this->postJson(route('admin.sendotp'), ['email' => $email, 'password' => $password]);

        $response->assertStatus(200);
        

        $response->assertJson([
            'status' => true,
            'errors' => null,
        ]);

        $user = Admin::where('email', $email)->first();
        $response = $this->postJson(route('admin.otpVerify'), ['email' => $email, 'otp' => $user->otp]);

        $response->assertJson([
            'status' => true,
        ]);

        $this->assertNotNull($response->json('data.token'));
        $this->adminToken = $response->json('data.token');
 

        $response = $this->postJson(route('user.otpVerify'), ['email' => $email, 'otp' => '99999']);
        $response->assertStatus(422);
        return $this->adminToken;
    }

    public function test_create_videos(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        
        $this->test_crud('admin.videos', $this->adminToken, 1, ['store'], config('aman.videos')[0]);
        $this->test_crud('admin.videos', $this->adminToken, 1, ['store'], config('aman.videos')[1]);
    }
    
    public function test_create_FAQs(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        $faqs = config('aman.FAQs');
        foreach ($faqs as $faq) {
            $this->test_crud('admin.faqs', $this->adminToken, 1, ['store'], $faq); 
        }
    }

    public function test_contact_crud(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        $fak = Contact::factory()->make()->toArray();  
        $this->test_crud('admin.contacts', $this->adminToken, 1, ['index', 'edit', 'show', 'create', 'store', 'update', 'destroy', 'toggleActive'], $fak);
    }

    public function test_create_contacts(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        for ($i=0; $i < 10; $i++) { 
            $fak = Contact::factory()->make()->toArray();  
            $this->test_crud('admin.contacts', $this->adminToken, null, ['index', 'edit', 'show', 'create', 'store'], $fak);
        }
    }

    public function test_create_scenes(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        $scenes = config('aman.scenes');
        foreach ($scenes as $faq) {
            $this->test_crud('admin.scenes', $this->adminToken, 1, ['store'], $faq); 
        }
    }
    
    public function test_create_questions(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 
        $questions = config('aman.questions');
        foreach ($questions as $faq) {
            $this->test_crud('admin.questions', $this->adminToken, 1, ['store'], $faq); 
        }
    } 


    // Admin Dashboard Testing
    public function test_coupon_crud(): void
    {
        $this->test_admin_Send_request_otp_and_login();  
        $fak = Coupon::factory()->make()->toArray();  
        $this->test_crud('admin.coupons', $this->adminToken, 1, ['index', 'edit', 'show', 'create', 'store', 'update', 'destroy', 'toggleActive'], $fak);
    }
    
    public function test_create_coupons(): void
    {
        $this->test_admin_Send_request_otp_and_login(); 

        for ($i=0; $i < 10; $i++) { 
            $fak = Coupon::factory()->make()->toArray();  
            $this->test_crud('admin.coupons', $this->adminToken, null, ['index', 'edit', 'show', 'create', 'store'], $fak);
        }
    }
}
