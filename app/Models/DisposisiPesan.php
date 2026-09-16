<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DisposisiPesan extends Model
{
    protected $table = 'disposisi_pesans';

    protected $fillable = [
        'disposisi_id',
        'user_id',
        'pesan',
        'file_pdf',
        'file_nama',
        'file_mime',
        'file_size',
    ];

    protected $appends = [
        'file_url',
        'file_size_label',
    ];

    public function disposisi(): BelongsTo
    {
        return $this->belongsTo(
            Disposisi::class,
            'disposisi_id'
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'user_id'
        );
    }

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_pdf) {
            return null;
        }

        return url(
            '/storage/' .
            ltrim(
                $this->file_pdf,
                '/'
            )
        );
    }

    public function getFileSizeLabelAttribute(): ?string
    {
        if (!$this->file_size) {
            return null;
        }

        $size =
            (int) $this->file_size;

        if (
            $size >=
            1024 * 1024
        ) {
            return number_format(
                $size /
                    (1024 * 1024),
                2
            ) . ' MB';
        }

        if (
            $size >= 1024
        ) {
            return number_format(
                $size / 1024,
                1
            ) . ' KB';
        }

        return $size . ' B';
    }
}