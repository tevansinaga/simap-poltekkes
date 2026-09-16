<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SuratMasuk extends Model
{
    protected $table = 'surat_masuks';

    protected $fillable = [
        'nomor_surat',
        'tanggal_surat',
        'tanggal_diterima',
        'pengirim',
        'perihal',
        'sifat',
        'file_surat',
        'status',
        'created_by',
    ];

    protected $casts = [
        /*
         * PENTING:
         * Kedua field ini adalah DATE, bukan DATETIME.
         *
         * Format selalu YYYY-MM-DD.
         */
        'tanggal_surat' => 'date:Y-m-d',
        'tanggal_diterima' => 'date:Y-m-d',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }

    public function disposisis(): HasMany
    {
        return $this->hasMany(
            Disposisi::class,
            'surat_masuk_id'
        );
    }

    public function agendas(): HasMany
    {
        return $this->hasMany(
            Agenda::class,
            'surat_masuk_id'
        );
    }
}