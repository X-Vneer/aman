<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

/**
 * Idempotent production seeder: ensures the dashboard permission set exists and
 * creates (or refreshes) a single full-access admin.
 *
 * Run with: php artisan db:seed --class=ProdAdminSeeder --force
 */
class ProdAdminSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['name' => 'Overview', 'name_ar' => 'نظرة عامة'],
            ['name' => 'Website_Management', 'name_ar' => 'إدارة الموقع'],
            ['name' => 'User:Add', 'name_ar' => 'إضافة مستخدم'],
            ['name' => 'User:Edit', 'name_ar' => 'تعديل المستخدم'],
            ['name' => 'User:Delete', 'name_ar' => 'حذف المستخدم'],
            ['name' => 'User:Export', 'name_ar' => 'تصدير المستخدمين'],
            ['name' => 'Awareness:Add', 'name_ar' => 'إضافة التوعية'],
            ['name' => 'Awareness:Edit', 'name_ar' => 'تعديل التوعية'],
            ['name' => 'Awareness:Delete', 'name_ar' => 'حذف التوعية'],
            ['name' => 'Awareness:Export', 'name_ar' => 'تصدير التوعية'],
            ['name' => 'Awareness:View', 'name_ar' => 'عرض التوعية'],
            ['name' => 'Programs:Add', 'name_ar' => 'إضافة برنامج'],
            ['name' => 'Programs:Edit', 'name_ar' => 'تعديل البرنامج'],
            ['name' => 'Programs:Delete', 'name_ar' => 'حذف البرنامج'],
            ['name' => 'Programs:Export', 'name_ar' => 'تصدير البرنامج'],
            ['name' => 'Programs:View', 'name_ar' => 'عرض البرنامج'],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => 'sanctum'],
                ['name_ar' => $permission['name_ar'], 'name_en' => $permission['name']],
            );
        }

        // Match by email so re-runs refresh the same row instead of duplicating.
        $admin = Admin::updateOrCreate(
            ['email' => 'sara@aman.com'],
            [
                'name' => 'Sara',
                'mobile' => '966508570275',
                'role_name' => 'Admin',
                'password' => '12345678', // auto-hashed via the 'hashed' cast
            ],
        );

        // Grant full access.
        $admin->permissions()->sync(Permission::pluck('id')->all());
    }
}
