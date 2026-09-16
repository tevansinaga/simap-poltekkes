<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agendas', function (Blueprint $table) {
            $table->string('judul')->nullable()->after('id');

            $table->date('tanggal')->nullable()->after('judul');

            $table->time('waktu_mulai')->nullable()->after('tanggal');
            $table->time('waktu_selesai')->nullable()->after('waktu_mulai');

            $table->string('lokasi')->nullable()->after('waktu_selesai');

            $table->string('jenis')
                ->default('Rapat')
                ->after('lokasi');

            $table->text('keterangan')->nullable()->after('jenis');

            $table->foreignId('created_by')
                ->nullable()
                ->after('keterangan')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('agendas', function (Blueprint $table) {
            $table->dropForeign(['created_by']);

            $table->dropColumn([
                'judul',
                'tanggal',
                'waktu_mulai',
                'waktu_selesai',
                'lokasi',
                'jenis',
                'keterangan',
                'created_by',
            ]);
        });
    }
};