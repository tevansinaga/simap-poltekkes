<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Akses penuh ke seluruh sistem',
            ],
            [
                'name' => 'Direktur',
                'slug' => 'direktur',
                'description' => 'Akses informasi dan agenda Direktur',
            ],
            [
                'name' => 'Sekretaris Direktur',
                'slug' => 'sekretaris-direktur',
                'description' => 'Mengatur agenda dan surat Direktur',
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'description' => 'Administrator sistem',
            ],
            [
                'name' => 'Kepala Unit',
                'slug' => 'kepala-unit',
                'description' => 'Mengelola surat dan agenda pada unit',
            ],
            [
                'name' => 'Staf',
                'slug' => 'staf',
                'description' => 'Pengguna biasa',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                ]
            );
        }
    }
}