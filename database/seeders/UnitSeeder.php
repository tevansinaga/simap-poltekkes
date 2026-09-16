<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'name' => 'Direktur',
                'code' => 'DIR',
            ],
            [
                'name' => 'Wakil Direktur I',
                'code' => 'WADIR-I',
            ],
            [
                'name' => 'Wakil Direktur II',
                'code' => 'WADIR-II',
            ],
            [
                'name' => 'Wakil Direktur III',
                'code' => 'WADIR-III',
            ],
            [
                'name' => 'Bagian Akademik',
                'code' => 'BAA',
            ],
            [
                'name' => 'Bagian Keuangan',
                'code' => 'KEU',
            ],
            [
                'name' => 'Bagian Kepegawaian',
                'code' => 'PEG',
            ],
            [
                'name' => 'Bagian Umum',
                'code' => 'UMUM',
            ],
            [
                'name' => 'Unit Teknologi Informasi',
                'code' => 'TI',
            ],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['code' => $unit['code']],
                [
                    'name' => $unit['name'],
                ]
            );
        }
    }
}