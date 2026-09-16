<?php

namespace App\Http\Controllers\Direktur;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\Disposisi;
use App\Models\SuratMasuk;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class DisposisiController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | DAFTAR
    |--------------------------------------------------------------------------
    */

    public function index(): View
    {
        $disposisis = Disposisi::query()
            ->with([
                'suratMasuk',
                'dariUser',
                'unit',
            ])
            ->orderByDesc(
                'tanggal_disposisi'
            )
            ->orderByDesc('id')
            ->get();

        return view('disposisi', [
            'page' =>
                'disposisi',

            'disposisis' =>
                $disposisis,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | DETAIL
    |--------------------------------------------------------------------------
    */

    public function show(
        Disposisi $disposisi
    ): View {
        $disposisi->load([
            'suratMasuk.creator',
            'dariUser',
            'unit',
            'pesans.user',
        ]);

        return view(
            'disposisi-detail',
            [
                'page' =>
                    'disposisi-detail',

                'disposisi' =>
                    $disposisi,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create(
        SuratMasuk $suratMasuk
    ): View {
        $units = Unit::query()
            ->where(
                'is_active',
                true
            )
            ->orderBy('name')
            ->get();

        $suratMasuk->load(
            'creator'
        );

        return view('disposisi', [
            'page' =>
                'disposisi-create',

            'suratMasuk' =>
                $suratMasuk,

            'units' =>
                $units,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request,
        SuratMasuk $suratMasuk
    ): RedirectResponse {
        $validated = $request->validate(
            [
                'tujuan_type' => [
                    'required',
                    'in:unit,direktur',
                ],

                'ke_unit_id' => [
                    'nullable',
                    'required_if:tujuan_type,unit',
                    'exists:units,id',
                ],

                'instruksi' => [
                    'required',
                    'string',
                    'max:2000',
                ],

                'sifat' => [
                    'required',
                    'in:Biasa,Penting,Sangat Penting,Rahasia',
                ],

                'batas_waktu' => [
                    'nullable',
                    'date_format:Y-m-d',
                ],

                'agenda_judul' => [
                    'nullable',
                    'required_if:tujuan_type,direktur',
                    'string',
                    'max:255',
                ],

                'agenda_tanggal' => [
                    'nullable',
                    'required_if:tujuan_type,direktur',
                    'date_format:Y-m-d',
                ],

                'agenda_waktu_mulai' => [
                    'nullable',
                    'required_if:tujuan_type,direktur',
                    'date_format:H:i',
                ],

                'agenda_waktu_selesai' => [
                    'nullable',
                    'date_format:H:i',
                    'after_or_equal:agenda_waktu_mulai',
                ],

                'agenda_lokasi' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'agenda_jenis' => [
                    'nullable',
                    'required_if:tujuan_type,direktur',
                    'string',
                    'max:100',
                ],

                'agenda_keterangan' => [
                    'nullable',
                    'string',
                ],
            ],
            [
                'tujuan_type.required' =>
                    'Tujuan disposisi wajib dipilih.',

                'tujuan_type.in' =>
                    'Tujuan disposisi tidak valid.',

                'ke_unit_id.required_if' =>
                    'Unit tujuan wajib dipilih.',

                'ke_unit_id.exists' =>
                    'Unit tujuan tidak valid.',

                'instruksi.required' =>
                    'Instruksi disposisi wajib diisi.',

                'sifat.required' =>
                    'Sifat disposisi wajib dipilih.',

                'sifat.in' =>
                    'Sifat disposisi tidak valid.',

                'batas_waktu.date_format' =>
                    'Format batas waktu harus YYYY-MM-DD.',

                'agenda_judul.required_if' =>
                    'Judul agenda wajib diisi apabila tujuan Direktur.',

                'agenda_tanggal.required_if' =>
                    'Tanggal agenda wajib diisi apabila tujuan Direktur.',

                'agenda_tanggal.date_format' =>
                    'Format tanggal agenda harus YYYY-MM-DD.',

                'agenda_waktu_mulai.required_if' =>
                    'Waktu mulai agenda wajib diisi apabila tujuan Direktur.',

                'agenda_waktu_mulai.date_format' =>
                    'Format waktu mulai harus HH:MM.',

                'agenda_waktu_selesai.date_format' =>
                    'Format waktu selesai harus HH:MM.',

                'agenda_waktu_selesai.after_or_equal' =>
                    'Waktu selesai harus setelah atau sama dengan waktu mulai.',

                'agenda_jenis.required_if' =>
                    'Jenis agenda wajib diisi apabila tujuan Direktur.',
            ]
        );

        DB::transaction(
            function () use (
                $validated,
                $suratMasuk
            ) {
                Disposisi::create([
                    'surat_masuk_id' =>
                        $suratMasuk->id,

                    'dari_user_id' =>
                        Auth::id(),

                    'tujuan_type' =>
                        $validated['tujuan_type'],

                    'ke_unit_id' =>
                        $validated['tujuan_type'] === 'unit'
                            ? (
                                $validated['ke_unit_id']
                                ?? null
                            )
                            : null,

                    'instruksi' =>
                        $validated['instruksi'],

                    'sifat' =>
                        $validated['sifat'],

                    'batas_waktu' =>
                        $validated['batas_waktu']
                        ?? null,

                    'status' =>
                        'terkirim',

                    'tanggal_disposisi' =>
                        now(),
                ]);

                $suratMasuk->update([
                    'status' =>
                        'sudah_didisposisi',
                ]);

                /*
                |--------------------------------------------------------------------------
                | AGENDA OTOMATIS UNTUK DIREKTUR
                |--------------------------------------------------------------------------
                */

                if (
                    $validated['tujuan_type'] ===
                    'direktur'
                ) {
                    Agenda::create([
                        'surat_masuk_id' =>
                            $suratMasuk->id,

                        'judul' =>
                            $validated['agenda_judul'],

                        'tanggal' =>
                            $validated['agenda_tanggal'],

                        'waktu_mulai' =>
                            $validated['agenda_waktu_mulai'],

                        'waktu_selesai' =>
                            $validated['agenda_waktu_selesai']
                            ?? null,

                        'lokasi' =>
                            $validated['agenda_lokasi']
                            ?? null,

                        'jenis' =>
                            $validated['agenda_jenis'],

                        'keterangan' =>
                            $validated['agenda_keterangan']
                            ??
                            $validated['instruksi']
                            ??
                            null,

                        'created_by' =>
                            Auth::id(),
                    ]);
                }
            }
        );

        $message =
            $validated['tujuan_type'] ===
            'direktur'
                ? 'Disposisi berhasil dikirim ke Direktur dan agenda otomatis ditambahkan.'
                : 'Disposisi berhasil dikirim ke unit tujuan.';

        return redirect()
            ->route(
                'sekretaris.surat-masuk.show',
                $suratMasuk
            )
            ->with(
                'success',
                $message
            );
    }
}