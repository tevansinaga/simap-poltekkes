<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agenda extends Model
{
    protected $table = 'agendas';

    protected $fillable = [
        'surat_masuk_id',
        'judul',
        'tanggal',
        'waktu_mulai',
        'waktu_selesai',
        'lokasi',
        'jenis',
        'keterangan',
        'created_by',
    ];

    /**
     * Tanggal agenda adalah DATE ONLY.
     *
     * Selalu simpan/tampilkan sebagai:
     * YYYY-MM-DD
     *
     * Jangan biarkan JSON mengubahnya menjadi
     * datetime UTC seperti:
     * 2026-09-19T17:00:00.000000Z
     */
    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];

    /**
     * Paksa serialisasi tanggal menjadi YYYY-MM-DD.
     *
     * Ini yang penting agar React menerima:
     *
     * "2026-09-20"
     *
     * bukan:
     *
     * "2026-09-19T17:00:00.000000Z"
     */
    protected function serializeDate(
        DateTimeInterface $date
    ): string {
        return $date->format('Y-m-d');
    }

    public function suratMasuk(): BelongsTo
    {
        return $this->belongsTo(
            SuratMasuk::class,
            'surat_masuk_id'
        );
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}