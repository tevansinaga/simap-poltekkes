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
        Schema::table('disposisis', function (Blueprint $table) {
            /*
             * Tujuan disposisi:
             * - unit
             * - direktur
             */
            $table
                ->string('tujuan_type')
                ->default('unit')
                ->after('dari_user_id');

            /*
             * Untuk tujuan Direktur, ke_unit_id tidak diperlukan.
             */
            $table
                ->foreignId('ke_unit_id')
                ->nullable()
                ->change();
        });
    }

    /**
     * Membatalkan migration.
     */
    public function down(): void
    {
        Schema::table('disposisis', function (Blueprint $table) {
            $table->dropColumn('tujuan_type');

            /*
             * Kembalikan menjadi wajib.
             */
            $table
                ->foreignId('ke_unit_id')
                ->nullable(false)
                ->change();
        });
    }
};