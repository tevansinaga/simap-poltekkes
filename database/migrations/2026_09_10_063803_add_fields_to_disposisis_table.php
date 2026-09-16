<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('disposisis', function (Blueprint $table) {
            $table->foreignId('surat_masuk_id')
                ->nullable()
                ->after('id')
                ->constrained('surat_masuks')
                ->cascadeOnDelete();

            $table->foreignId('dari_user_id')
                ->nullable()
                ->after('surat_masuk_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('ke_unit_id')
                ->nullable()
                ->after('dari_user_id')
                ->constrained('units')
                ->nullOnDelete();

            $table->text('instruksi')->nullable()->after('ke_unit_id');

            $table->string('status')
                ->default('terkirim')
                ->after('instruksi');

            $table->dateTime('tanggal_disposisi')
                ->nullable()
                ->after('status');

            $table->dateTime('selesai_at')
                ->nullable()
                ->after('tanggal_disposisi');
        });
    }

    public function down(): void
    {
        Schema::table('disposisis', function (Blueprint $table) {
            $table->dropForeign(['surat_masuk_id']);
            $table->dropForeign(['dari_user_id']);
            $table->dropForeign(['ke_unit_id']);

            $table->dropColumn([
                'surat_masuk_id',
                'dari_user_id',
                'ke_unit_id',
                'instruksi',
                'status',
                'tanggal_disposisi',
                'selesai_at',
            ]);
        });
    }
};