<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surat_masuks', function (Blueprint $table) {
            $table->string('nomor_surat')->nullable()->after('id');
            $table->date('tanggal_surat')->nullable()->after('nomor_surat');
            $table->date('tanggal_diterima')->nullable()->after('tanggal_surat');

            $table->string('pengirim')->nullable()->after('tanggal_diterima');
            $table->string('perihal')->nullable()->after('pengirim');

            $table->string('sifat')->default('Biasa')->after('perihal');

            $table->string('file_surat')->nullable()->after('sifat');

            $table->string('status')
                ->default('menunggu_disposisi')
                ->after('file_surat');

            $table->foreignId('created_by')
                ->nullable()
                ->after('status')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('surat_masuks', function (Blueprint $table) {
            $table->dropForeign(['created_by']);

            $table->dropColumn([
                'nomor_surat',
                'tanggal_surat',
                'tanggal_diterima',
                'pengirim',
                'perihal',
                'sifat',
                'file_surat',
                'status',
                'created_by',
            ]);
        });
    }
};