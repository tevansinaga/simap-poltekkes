<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disposisi extends Model
{
    protected $table = 'disposisis';

    protected $fillable = [
        'surat_masuk_id',
        'dari_user_id',
        'tujuan_type',
        'ke_unit_id',
        'instruksi',
        'catatan_tindak_lanjut',
        'sifat',
        'batas_waktu',
        'status',
        'tanggal_disposisi',
        'selesai_at',
    ];

    protected $casts = [
        /*
        |--------------------------------------------------------------------------
        | BATAS WAKTU
        |--------------------------------------------------------------------------
        |
        | Field ini adalah DATE saja, bukan DATETIME.
        |
        | Contoh nilai database:
        | 2026-09-20
        |
        | Saat dikirim ke React, Laravel akan mempertahankan:
        | 2026-09-20
        |
        | sehingga tidak berubah menjadi tanggal UTC seperti:
        | 2026-09-19T17:00:00...
        |
        */
        'batas_waktu' => 'date:Y-m-d',

        /*
        |--------------------------------------------------------------------------
        | FIELD DATETIME
        |--------------------------------------------------------------------------
        */
        'tanggal_disposisi' => 'datetime',
        'selesai_at' => 'datetime',
    ];

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(
            SuratMasuk::class,
            'surat_masuk_id'
        );
    }

    public function dariUser(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'dari_user_id'
        );
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(
            Unit::class,
            'ke_unit_id'
        );
    }

    public function pesans(): HasMany
    {
        return $this->hasMany(
            DisposisiPesan::class,
            'disposisi_id'
        )->orderBy('created_at');
    }

    public function isUntukDirektur(): bool
    {
        return $this->tujuan_type === 'direktur';
    }

    public function isUntukUnit(): bool
    {
        return $this->tujuan_type === 'unit';
    }
}