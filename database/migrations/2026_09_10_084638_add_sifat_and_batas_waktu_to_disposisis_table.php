<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('disposisis', function (Blueprint $table) {
            $table->string('sifat')
                ->default('Biasa')
                ->after('instruksi');

            $table->date('batas_waktu')
                ->nullable()
                ->after('sifat');
        });
    }

    public function down(): void
    {
        Schema::table('disposisis', function (Blueprint $table) {
            $table->dropColumn([
                'sifat',
                'batas_waktu',
            ]);
        });
    }
};