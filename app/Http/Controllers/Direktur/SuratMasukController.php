<?php

namespace App\Http\Controllers\Direktur;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class SuratMasukController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | INDEX
    |--------------------------------------------------------------------------
    */

    public function index(): View
    {
        $suratMasuk = SuratMasuk::query()
            ->with([
                'creator',
                'disposisis.unit',
                'disposisis.dariUser',
                'agendas',
            ])
            ->orderByDesc('tanggal_diterima')
            ->orderByDesc('id')
            ->get();

        return view('surat-masuk', [
            'page' => 'surat-masuk',
            'suratMasuk' => $suratMasuk,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    public function create(): View
    {
        return view('surat-masuk', [
            'page' => 'surat-masuk-create',
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */

    public function store(
        Request $request
    ): RedirectResponse {
        $validated = $request->validate([
            'nomor_surat' => [
                'required',
                'string',
                'max:255',
            ],

            /*
             * PENTING:
             * gunakan date_format:Y-m-d,
             * bukan date.
             *
             * Dengan ini nilai "2026-09-16"
             * diperlakukan sebagai tanggal murni.
             */
            'tanggal_surat' => [
                'required',
                'date_format:Y-m-d',
            ],

            'tanggal_diterima' => [
                'required',
                'date_format:Y-m-d',
            ],

            'pengirim' => [
                'required',
                'string',
                'max:255',
            ],

            'perihal' => [
                'required',
                'string',
                'max:1000',
            ],

            'sifat' => [
                'required',
                'in:Biasa,Penting,Sangat Penting,Rahasia',
            ],

            'file_surat' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],
        ], [
            'nomor_surat.required' =>
                'Nomor surat wajib diisi.',

            'tanggal_surat.required' =>
                'Tanggal surat wajib diisi.',

            'tanggal_surat.date_format' =>
                'Format tanggal surat harus YYYY-MM-DD.',

            'tanggal_diterima.required' =>
                'Tanggal diterima wajib diisi.',

            'tanggal_diterima.date_format' =>
                'Format tanggal diterima harus YYYY-MM-DD.',

            'pengirim.required' =>
                'Pengirim wajib diisi.',

            'perihal.required' =>
                'Perihal wajib diisi.',

            'sifat.required' =>
                'Sifat surat wajib dipilih.',

            'sifat.in' =>
                'Sifat surat tidak valid.',

            'file_surat.mimes' =>
                'File surat harus berupa PDF.',

            'file_surat.max' =>
                'Ukuran file surat maksimal 10 MB.',
        ]);

        /*
         * Pastikan nilai tanggal benar-benar
         * berupa string YYYY-MM-DD.
         *
         * Tidak menggunakan Carbon::parse().
         * Tidak menggunakan timezone.
         */

        $tanggalSurat =
            $validated['tanggal_surat'];

        $tanggalDiterima =
            $validated['tanggal_diterima'];

        $filePath = null;

        if (
            $request->hasFile('file_surat')
        ) {
            $filePath =
                $request
                    ->file('file_surat')
                    ->store(
                        'surat-masuk',
                        'public'
                    );
        }

        SuratMasuk::create([
            'nomor_surat' =>
                $validated['nomor_surat'],

            'tanggal_surat' =>
                $tanggalSurat,

            'tanggal_diterima' =>
                $tanggalDiterima,

            'pengirim' =>
                $validated['pengirim'],

            'perihal' =>
                $validated['perihal'],

            'sifat' =>
                $validated['sifat'],

            'file_surat' =>
                $filePath,

            'status' =>
                'menunggu_disposisi',

            'created_by' =>
                Auth::id(),
        ]);

        return redirect()
            ->route(
                'sekretaris.surat-masuk'
            )
            ->with(
                'success',
                'Surat masuk berhasil ditambahkan.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | SHOW
    |--------------------------------------------------------------------------
    */

    public function show(
        SuratMasuk $suratMasuk
    ): View {
        $suratMasuk->load([
            'creator',
            'disposisis.unit',
            'disposisis.dariUser',
            'agendas',
        ]);

        return view('surat-masuk', [
            'page' =>
                'surat-masuk-detail',

            'suratMasuk' =>
                $suratMasuk,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | SHOW DIREKTUR
    |--------------------------------------------------------------------------
    */

    public function showDirektur(
        SuratMasuk $suratMasuk
    ): View {
        $suratMasuk->load([
            'creator',
            'disposisis.unit',
            'disposisis.dariUser',
            'agendas',
        ]);

        return view('surat-masuk', [
            'page' =>
                'surat-masuk-detail-direktur',

            'suratMasuk' =>
                $suratMasuk,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    public function edit(
        SuratMasuk $suratMasuk
    ): View {
        return view('surat-masuk', [
            'page' =>
                'surat-masuk-edit',

            'suratMasuk' =>
                $suratMasuk,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        SuratMasuk $suratMasuk
    ): RedirectResponse {
        $validated = $request->validate([
            'nomor_surat' => [
                'required',
                'string',
                'max:255',
            ],

            'tanggal_surat' => [
                'required',
                'date_format:Y-m-d',
            ],

            'tanggal_diterima' => [
                'required',
                'date_format:Y-m-d',
            ],

            'pengirim' => [
                'required',
                'string',
                'max:255',
            ],

            'perihal' => [
                'required',
                'string',
                'max:1000',
            ],

            'sifat' => [
                'required',
                'in:Biasa,Penting,Sangat Penting,Rahasia',
            ],

            'file_surat' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:10240',
            ],
        ], [
            'nomor_surat.required' =>
                'Nomor surat wajib diisi.',

            'tanggal_surat.required' =>
                'Tanggal surat wajib diisi.',

            'tanggal_surat.date_format' =>
                'Format tanggal surat harus YYYY-MM-DD.',

            'tanggal_diterima.required' =>
                'Tanggal diterima wajib diisi.',

            'tanggal_diterima.date_format' =>
                'Format tanggal diterima harus YYYY-MM-DD.',

            'pengirim.required' =>
                'Pengirim wajib diisi.',

            'perihal.required' =>
                'Perihal wajib diisi.',

            'sifat.required' =>
                'Sifat surat wajib dipilih.',

            'sifat.in' =>
                'Sifat surat tidak valid.',

            'file_surat.mimes' =>
                'File surat harus berupa PDF.',

            'file_surat.max' =>
                'Ukuran file surat maksimal 10 MB.',
        ]);

        $suratMasuk->nomor_surat =
            $validated['nomor_surat'];

        /*
         * Jangan menggunakan Carbon.
         * Simpan langsung YYYY-MM-DD.
         */

        $suratMasuk->tanggal_surat =
            $validated['tanggal_surat'];

        $suratMasuk->tanggal_diterima =
            $validated['tanggal_diterima'];

        $suratMasuk->pengirim =
            $validated['pengirim'];

        $suratMasuk->perihal =
            $validated['perihal'];

        $suratMasuk->sifat =
            $validated['sifat'];

        /*
         * Ganti file hanya jika
         * pengguna memilih file baru.
         */

        if (
            $request->hasFile('file_surat')
        ) {
            if (
                $suratMasuk->file_surat
            ) {
                Storage::disk('public')
                    ->delete(
                        $suratMasuk->file_surat
                    );
            }

            $suratMasuk->file_surat =
                $request
                    ->file('file_surat')
                    ->store(
                        'surat-masuk',
                        'public'
                    );
        }

        $suratMasuk->save();

        return redirect()
            ->route(
                'sekretaris.surat-masuk.show',
                $suratMasuk
            )
            ->with(
                'success',
                'Surat masuk berhasil diperbarui.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | DESTROY
    |--------------------------------------------------------------------------
    */

    public function destroy(
        SuratMasuk $suratMasuk
    ): RedirectResponse {
        if (
            $suratMasuk->file_surat
        ) {
            Storage::disk('public')
                ->delete(
                    $suratMasuk->file_surat
                );
        }

        $suratMasuk->delete();

        return redirect()
            ->route(
                'sekretaris.surat-masuk'
            )
            ->with(
                'success',
                'Surat masuk berhasil dihapus.'
            );
    }
}