<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        Schema::table('agendas', function (Blueprint $table) {
            $table->foreignId('surat_masuk_id')
                ->nullable()
                ->after('id')
                ->constrained('surat_masuks')
                ->nullOnDelete();
        });
    }

    /**
     * Membatalkan migration.
     */
    public function down(): void
    {
        Schema::table('agendas', function (Blueprint $table) {
            $table->dropForeign([
                'surat_masuk_id'
            ]);

            $table->dropColumn('surat_masuk_id');
        });
    }
};