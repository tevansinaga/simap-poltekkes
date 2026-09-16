<?php

namespace App\Http\Controllers\Unit;

use App\Http\Controllers\Controller;
use App\Models\Disposisi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DisposisiUnitController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | QUERY DASAR UNIT
    |--------------------------------------------------------------------------
    |
    | Unit hanya boleh melihat disposisi yang memang ditujukan kepada
    | unit miliknya sendiri.
    |
    */

    private function baseQuery()
    {
        $user = Auth::user();

        return Disposisi::query()
            ->where(
                'tujuan_type',
                'unit'
            )
            ->where(
                'ke_unit_id',
                $user->unit_id
            );
    }

    /*
    |--------------------------------------------------------------------------
    | OTORISASI DISPOSISI
    |--------------------------------------------------------------------------
    */

    private function authorizeDisposisi(
        Disposisi $disposisi
    ): void {
        $user = Auth::user();

        abort_if(
            $disposisi->tujuan_type !== 'unit' ||
            (int) $disposisi->ke_unit_id !==
                (int) $user->unit_id,
            403,
            'Anda tidak memiliki akses ke disposisi ini.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index(): View
    {
        $disposisis =
            $this->baseQuery()
                ->with([
                    'suratMasuk',
                    'dariUser',
                    'unit',
                    'pesans.user',
                ])
                ->orderByDesc(
                    'tanggal_disposisi'
                )
                ->orderByDesc('id')
                ->get();

        return view(
            'disposisi-unit',
            [
                'page' =>
                    'disposisi-unit',

                'disposisis' =>
                    $disposisis,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */

    public function show(
        Disposisi $disposisi
    ): View {
        $this->authorizeDisposisi(
            $disposisi
        );

        $disposisi->load([
            'suratMasuk.creator',
            'dariUser',
            'unit',
            'pesans.user',
        ]);

        return view(
            'disposisi-unit-detail',
            [
                'page' =>
                    'disposisi-unit-detail',

                'disposisi' =>
                    $disposisi,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MULAI
    |--------------------------------------------------------------------------
    */

    public function mulai(
        Disposisi $disposisi
    ): RedirectResponse {
        $this->authorizeDisposisi(
            $disposisi
        );

        /*
        |--------------------------------------------------------------------------
        | Hanya disposisi Terkirim yang bisa dimulai
        |--------------------------------------------------------------------------
        */

        if (
            $disposisi->status !==
            'terkirim'
        ) {
            return back()
                ->with(
                    'success',
                    'Disposisi ini sudah diproses sebelumnya.'
                );
        }

        DB::transaction(
            function () use (
                $disposisi
            ) {
                /*
                |--------------------------------------------------------------------------
                | Ubah disposisi menjadi Dalam Proses
                |--------------------------------------------------------------------------
                */

                $disposisi->update([
                    'status' =>
                        'in_progress',
                ]);

                /*
                |--------------------------------------------------------------------------
                | Surat tetap berstatus Sudah Didisposisi
                |--------------------------------------------------------------------------
                */

                $suratMasuk =
                    $disposisi
                        ->suratMasuk;

                if (
                    $suratMasuk &&
                    $suratMasuk->status !==
                        'selesai'
                ) {
                    $suratMasuk->update([
                        'status' =>
                            'sudah_didisposisi',
                    ]);
                }
            }
        );

        return back()
            ->with(
                'success',
                'Disposisi berhasil dimulai dan sekarang dalam proses.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | CATATAN LAMA
    |--------------------------------------------------------------------------
    |
    | Dipertahankan untuk kompatibilitas data lama.
    | Sistem chat baru menggunakan disposisi_pesans.
    |
    */

    public function simpanCatatan(
        Request $request,
        Disposisi $disposisi
    ): RedirectResponse {
        $this->authorizeDisposisi(
            $disposisi
        );

        /*
        |--------------------------------------------------------------------------
        | Tidak boleh mengubah catatan setelah selesai
        |--------------------------------------------------------------------------
        */

        if (
            $disposisi->status ===
            'selesai'
        ) {
            return back()
                ->withErrors([
                    'pesan' =>
                        'Disposisi yang sudah selesai tidak dapat diubah lagi.',
                ]);
        }

        $validated =
            $request->validate(
                [
                    'catatan_tindak_lanjut' => [
                        'required',
                        'string',
                        'max:5000',
                    ],
                ],
                [
                    'catatan_tindak_lanjut.required' =>
                        'Catatan tindak lanjut wajib diisi.',

                    'catatan_tindak_lanjut.max' =>
                        'Catatan tindak lanjut maksimal 5000 karakter.',
                ]
            );

        DB::transaction(
            function () use (
                $validated,
                $disposisi
            ) {
                $data = [
                    'catatan_tindak_lanjut' =>
                        $validated[
                            'catatan_tindak_lanjut'
                        ],
                ];

                /*
                |--------------------------------------------------------------------------
                | Jika masih Terkirim, otomatis menjadi Dalam Proses
                |--------------------------------------------------------------------------
                */

                if (
                    $disposisi->status ===
                    'terkirim'
                ) {
                    $data['status'] =
                        'in_progress';
                }

                $disposisi->update(
                    $data
                );

                /*
                |--------------------------------------------------------------------------
                | Surat dipastikan berstatus Sudah Didisposisi
                |--------------------------------------------------------------------------
                */

                $suratMasuk =
                    $disposisi
                        ->suratMasuk;

                if (
                    $suratMasuk &&
                    $suratMasuk->status !==
                        'selesai'
                ) {
                    $suratMasuk->update([
                        'status' =>
                            'sudah_didisposisi',
                    ]);
                }
            }
        );

        return back()
            ->with(
                'success',
                'Catatan tindak lanjut berhasil disimpan.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | SELESAI
    |--------------------------------------------------------------------------
    */

    public function selesai(
        Disposisi $disposisi
    ): RedirectResponse {
        $this->authorizeDisposisi(
            $disposisi
        );

        /*
        |--------------------------------------------------------------------------
        | Hanya status Dalam Proses yang boleh diselesaikan
        |--------------------------------------------------------------------------
        */

        if (
            $disposisi->status !==
            'in_progress'
        ) {
            return back()
                ->with(
                    'success',
                    'Disposisi harus berada dalam status Dalam Proses.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | CEK TINDAK LANJUT
        |--------------------------------------------------------------------------
        |
        | Disposisi hanya boleh selesai jika sudah ada:
        |
        | 1. catatan lama
        | ATAU
        | 2. pesan chat
        |
        */

        $hasOldNote =
            !empty(
                $disposisi
                    ->catatan_tindak_lanjut
            ) &&
            trim(
                (string)
                $disposisi
                    ->catatan_tindak_lanjut
            ) !== '';

        $hasChat =
            $disposisi
                ->pesans()
                ->exists();

        if (
            !$hasOldNote &&
            !$hasChat
        ) {
            return back()
                ->withErrors([
                    'pesan' =>
                        'Isi balasan atau catatan tindak lanjut terlebih dahulu sebelum menandai disposisi selesai.',
                ]);
        }

        /*
        |--------------------------------------------------------------------------
        | UPDATE DALAM TRANSACTION
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $disposisi
            ) {
                /*
                |--------------------------------------------------------------------------
                | 1. Tandai disposisi selesai
                |--------------------------------------------------------------------------
                */

                $disposisi->update([
                    'status' =>
                        'selesai',

                    'selesai_at' =>
                        now(),
                ]);

                /*
                |--------------------------------------------------------------------------
                | 2. Ambil surat yang terkait
                |--------------------------------------------------------------------------
                */

                $suratMasuk =
                    $disposisi
                        ->suratMasuk;

                if (!$suratMasuk) {
                    return;
                }

                /*
                |--------------------------------------------------------------------------
                | 3. Periksa seluruh disposisi dari surat tersebut
                |--------------------------------------------------------------------------
                |
                | Surat baru dianggap SELESAI jika tidak ada lagi disposisi
                | yang statusnya bukan selesai.
                |
                */

                $masihAdaDisposisiAktif =
                    $suratMasuk
                        ->disposisis()
                        ->where(
                            'status',
                            '!=',
                            'selesai'
                        )
                        ->exists();

                /*
                |--------------------------------------------------------------------------
                | 4. Update status surat
                |--------------------------------------------------------------------------
                */

                if (
                    !$masihAdaDisposisiAktif
                ) {
                    $suratMasuk->update([
                        'status' =>
                            'selesai',
                    ]);
                } else {
                    /*
                    |--------------------------------------------------------------------------
                    | Masih ada disposisi lain yang belum selesai.
                    |--------------------------------------------------------------------------
                    */

                    $suratMasuk->update([
                        'status' =>
                            'sudah_didisposisi',
                    ]);
                }
            }
        );

        return back()
            ->with(
                'success',
                'Disposisi berhasil ditandai sebagai selesai.'
            );
    }
}