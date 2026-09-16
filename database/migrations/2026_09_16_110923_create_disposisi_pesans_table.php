<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disposisi_pesans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('disposisi_id')
                ->constrained('disposisis')
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | PESAN
            |--------------------------------------------------------------------------
            */

            $table->text('pesan')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | LAMPIRAN PDF
            |--------------------------------------------------------------------------
            */

            $table->string('file_pdf')
                ->nullable();

            $table->string('file_nama')
                ->nullable();

            $table->string('file_mime')
                ->nullable();

            $table->unsignedBigInteger('file_size')
                ->nullable();

            $table->timestamps();

            /*
            |--------------------------------------------------------------------------
            | INDEX
            |--------------------------------------------------------------------------
            */

            $table->index([
                'disposisi_id',
                'created_at',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disposisi_pesans');
    }
};