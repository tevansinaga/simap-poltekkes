<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Jalankan Role dan Unit terlebih dahulu
        $this->call([
            RoleSeeder::class,
            UnitSeeder::class,
        ]);

        // =====================================================
        // AMBIL ROLE
        // =====================================================

        $superAdminRole = Role::where('slug', 'super-admin')->first();
        $direkturRole = Role::where('slug', 'direktur')->first();
        $sekretarisRole = Role::where('slug', 'sekretaris-direktur')->first();
        $adminRole = Role::where('slug', 'admin')->first();
        $kepalaUnitRole = Role::where('slug', 'kepala-unit')->first();
        $stafRole = Role::where('slug', 'staf')->first();

        // =====================================================
        // AMBIL UNIT
        // =====================================================

        $unitDirektur = Unit::where('code', 'DIR')->first();
        $unitUmum = Unit::where('code', 'UMUM')->first();
        $unitAkademik = Unit::where('code', 'BAA')->first();
        $unitKeuangan = Unit::where('code', 'KEU')->first();
        $unitKepegawaian = Unit::where('code', 'PEG')->first();
        $unitTI = Unit::where('code', 'TI')->first();

        // =====================================================
        // USER SUPER ADMIN
        // =====================================================

        User::updateOrCreate(
            ['email' => 'superadmin@poltekkes.ac.id'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password123'),
                'role_id' => $superAdminRole?->id,
                'unit_id' => $unitTI?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // USER DIREKTUR
        // =====================================================

        User::updateOrCreate(
            ['email' => 'direktur@poltekkes.ac.id'],
            [
                'name' => 'Ibu Direktur',
                'password' => Hash::make('password123'),
                'role_id' => $direkturRole?->id,
                'unit_id' => $unitDirektur?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // SEKRETARIS DIREKTUR
        // =====================================================

        User::updateOrCreate(
            ['email' => 'sekretaris@poltekkes.ac.id'],
            [
                'name' => 'Sekretaris Direktur',
                'password' => Hash::make('password123'),
                'role_id' => $sekretarisRole?->id,
                'unit_id' => $unitDirektur?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // ADMIN
        // =====================================================

        User::updateOrCreate(
            ['email' => 'admin@poltekkes.ac.id'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole?->id,
                'unit_id' => $unitUmum?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // KEPALA UNIT AKADEMIK
        // =====================================================

        User::updateOrCreate(
            ['email' => 'kepala.akademik@poltekkes.ac.id'],
            [
                'name' => 'Kepala Bagian Akademik',
                'password' => Hash::make('password123'),
                'role_id' => $kepalaUnitRole?->id,
                'unit_id' => $unitAkademik?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // KEPALA UNIT KEUANGAN
        // =====================================================

        User::updateOrCreate(
            ['email' => 'kepala.keuangan@poltekkes.ac.id'],
            [
                'name' => 'Kepala Bagian Keuangan',
                'password' => Hash::make('password123'),
                'role_id' => $kepalaUnitRole?->id,
                'unit_id' => $unitKeuangan?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // KEPALA UNIT KEPEGAWAIAN
        // =====================================================

        User::updateOrCreate(
            ['email' => 'kepala.kepegawaian@poltekkes.ac.id'],
            [
                'name' => 'Kepala Bagian Kepegawaian',
                'password' => Hash::make('password123'),
                'role_id' => $kepalaUnitRole?->id,
                'unit_id' => $unitKepegawaian?->id,
                'is_active' => true,
            ]
        );

        // =====================================================
        // STAF TI
        // =====================================================

        User::updateOrCreate(
            ['email' => 'staf.ti@poltekkes.ac.id'],
            [
                'name' => 'Staf Teknologi Informasi',
                'password' => Hash::make('password123'),
                'role_id' => $stafRole?->id,
                'unit_id' => $unitTI?->id,
                'is_active' => true,
            ]
        );
    }
}