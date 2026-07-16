<?php

namespace Database\Seeders;

use App\Models\Admin;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            [
                'name' => 'Overview',
                'name_ar' => 'نظرة عامة',
            ],
            [
                'name' => 'Website_Management',
                'name_ar' => 'إدارة الموقع',
            ],
            [
                'name' => 'Coupon:Add',
                'name_ar' => 'الإضافة إلى كوبون',
            ],
            [
                'name' => 'Coupon:Edit',
                'name_ar' => 'تعديل الكوبون',
            ],
            [
                'name' => 'Coupon:Delete',
                'name_ar' => 'حذف الكوبون',
            ],
            [
                'name' => 'Coupon:Export',
                'name_ar' => 'تصدير الكوبون',
            ],
            [
                'name' => 'User:Add',
                'name_ar' => 'إضافة مستخدم',
            ],
            [
                'name' => 'User:Edit',
                'name_ar' => 'تعديل المستخدم',
            ],
            [
                'name' => 'User:Delete',
                'name_ar' => 'حذف المستخدم',
            ],
            [
                'name' => 'User:Export',
                'name_ar' => 'تصدير المستخدمين',
            ],
            [
                'name' => 'Financial:Add',
                'name_ar' => 'إضافة مالية',
            ],
            [
                'name' => 'Financial:Edit',
                'name_ar' => 'تعديل المالية',
            ],
            [
                'name' => 'Financial:Delete',
                'name_ar' => 'حذف المالية',
            ],
            [
                'name' => 'Financial:Export',
                'name_ar' => 'تصدير المالية',
            ],

            ['name' => 'Awareness:Add', 'name_ar' => 'إضافة التوعية'],
            ['name' => 'Awareness:Edit', 'name_ar' => 'تعديل التوعية'],
            ['name' => 'Awareness:Delete', 'name_ar' => 'حذف التوعية'],
            ['name' => 'Awareness:Export', 'name_ar' => 'تصدير التوعية'],
            ['name' => 'Awareness:View', 'name_ar' => 'عرض التوعية'],
            ['name' => 'Programs:Add',    'name_ar' => 'إضافة برنامج'],
            ['name' => 'Programs:Edit',   'name_ar' => 'تعديل البرنامج'],
            ['name' => 'Programs:Delete', 'name_ar' => 'حذف البرنامج'],
            ['name' => 'Programs:Export', 'name_ar' => 'تصدير البرنامج'],
            ['name' => 'Programs:View',   'name_ar' => 'عرض البرنامج'],

        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'name' => $permission['name'],
                'name_ar' => $permission['name_ar'], // Add Arabic name
                'name_en' => $permission['name'], // Default English name
                'guard_name' => 'sanctum', // Default English name
            ]);
        }

        // User::factory(10)->create();
        $admin = Admin::create([
            'email' => 'info@glow.net.sa',
            'password' => '123456',
            'mobile' => '966508570275',
            'name' => 'admin',
            'role_name' => 'Admin',
        ]);

        $permission_ids = Permission::where('id', '>', 0)->pluck('id')->toArray();
        $admin->permissions()->sync($permission_ids);
    }
}
