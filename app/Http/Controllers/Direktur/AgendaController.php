<?php

namespace App\Http\Controllers\Direktur;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\SuratMasuk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AgendaController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | AGENDA SEKRETARIS
    |--------------------------------------------------------------------------
    */

    public function index(): View
    {
        $agenda = Agenda::query()
            ->with([
                'creator',
                'suratMasuk',
            ])
            ->orderBy('tanggal')
            ->orderBy('waktu_mulai')
            ->orderBy('id')
            ->get();

        return view('agenda', [
            'page' => 'agenda',
            'agenda' => $agenda,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | AGENDA DIREKTUR
    |--------------------------------------------------------------------------
    |
    | Direktur dapat melihat semua agenda yang dibuat Sekretaris,
    | baik agenda yang berasal dari Surat Masuk maupun agenda manual.
    |
    */

    public function indexDirektur(): View
    {
        $agenda = Agenda::query()
            ->with([
                'creator',
                'suratMasuk',
            ])
            ->orderBy('tanggal')
            ->orderBy('waktu_mulai')
            ->orderBy('id')
            ->get();

        return view('agenda', [
            'page' => 'agenda-direktur',
            'agendaDirektur' => $agenda,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL AGENDA DIREKTUR
    |--------------------------------------------------------------------------
    */

    public function showDirektur(int $id): View
    {
        $agenda = Agenda::query()
            ->with([
                'creator',
                'suratMasuk.creator',
                'suratMasuk.disposisis.unit',
                'suratMasuk.disposisis.dariUser',
            ])
            ->findOrFail($id);

        return view('agenda', [
            'page' => 'agenda-detail-direktur',
            'agendaDetail' => $agenda,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | BUAT AGENDA
    |--------------------------------------------------------------------------
    */

    public function create(Request $request): View
    {
        $surat = null;

        if ($request->filled('surat_masuk_id')) {
            $surat = SuratMasuk::query()
                ->with([
                    'creator',
                    'disposisis.unit',
                    'disposisis.dariUser',
                ])
                ->find(
                    $request->integer('surat_masuk_id')
                );
        }

        return view('agenda', [
            'page' => 'agenda-create',
            'suratMasuk' => $surat,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | SIMPAN AGENDA
    |--------------------------------------------------------------------------
    */

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'surat_masuk_id' => [
                    'nullable',
                    'exists:surat_masuks,id',
                ],

                'judul' => [
                    'required',
                    'string',
                    'max:255',
                ],

                /*
                 * Agenda menggunakan tanggal kalender murni.
                 * Tidak perlu konversi timezone.
                 */
                'tanggal' => [
                    'required',
                    'date_format:Y-m-d',
                ],

                'waktu_mulai' => [
                    'required',
                    'date_format:H:i',
                ],

                'waktu_selesai' => [
                    'nullable',
                    'date_format:H:i',
                    'after_or_equal:waktu_mulai',
                ],

                'lokasi' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'jenis' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'keterangan' => [
                    'nullable',
                    'string',
                ],
            ],
            [
                'surat_masuk_id.exists' =>
                    'Surat masuk yang dipilih tidak valid.',

                'judul.required' =>
                    'Judul agenda wajib diisi.',

                'tanggal.required' =>
                    'Tanggal agenda wajib diisi.',

                'tanggal.date_format' =>
                    'Format tanggal agenda harus YYYY-MM-DD.',

                'waktu_mulai.required' =>
                    'Waktu mulai wajib diisi.',

                'waktu_mulai.date_format' =>
                    'Format waktu mulai harus HH:MM.',

                'waktu_selesai.date_format' =>
                    'Format waktu selesai harus HH:MM.',

                'waktu_selesai.after_or_equal' =>
                    'Waktu selesai harus setelah atau sama dengan waktu mulai.',

                'jenis.required' =>
                    'Jenis agenda wajib diisi.',
            ]
        );

        Agenda::create([
            'surat_masuk_id' =>
                $validated['surat_masuk_id'] ?? null,

            'judul' =>
                $validated['judul'],

            'tanggal' =>
                $validated['tanggal'],

            'waktu_mulai' =>
                $validated['waktu_mulai'],

            'waktu_selesai' =>
                $validated['waktu_selesai'] ?? null,

            'lokasi' =>
                $validated['lokasi'] ?? null,

            'jenis' =>
                $validated['jenis'],

            'keterangan' =>
                $validated['keterangan'] ?? null,

            'created_by' =>
                Auth::id(),
        ]);

        return redirect()
            ->route('sekretaris.agenda')
            ->with(
                'success',
                'Agenda berhasil ditambahkan.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | DETAIL AGENDA SEKRETARIS
    |--------------------------------------------------------------------------
    */

    public function show(Agenda $agenda): View
    {
        $agenda->load([
            'creator',
            'suratMasuk.creator',
            'suratMasuk.disposisis.unit',
            'suratMasuk.disposisis.dariUser',
        ]);

        return view('agenda', [
            'page' => 'agenda-detail',
            'agenda' => $agenda,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT AGENDA
    |--------------------------------------------------------------------------
    */

    public function edit(Agenda $agenda): View
    {
        $agenda->load([
            'creator',
            'suratMasuk',
        ]);

        return view('agenda', [
            'page' => 'agenda-edit',
            'agenda' => $agenda,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | UPDATE AGENDA
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Agenda $agenda
    ): RedirectResponse {
        $validated = $request->validate(
            [
                'surat_masuk_id' => [
                    'nullable',
                    'exists:surat_masuks,id',
                ],

                'judul' => [
                    'required',
                    'string',
                    'max:255',
                ],

                'tanggal' => [
                    'required',
                    'date_format:Y-m-d',
                ],

                'waktu_mulai' => [
                    'required',
                    'date_format:H:i',
                ],

                'waktu_selesai' => [
                    'nullable',
                    'date_format:H:i',
                    'after_or_equal:waktu_mulai',
                ],

                'lokasi' => [
                    'nullable',
                    'string',
                    'max:255',
                ],

                'jenis' => [
                    'required',
                    'string',
                    'max:100',
                ],

                'keterangan' => [
                    'nullable',
                    'string',
                ],
            ],
            [
                'surat_masuk_id.exists' =>
                    'Surat masuk yang dipilih tidak valid.',

                'judul.required' =>
                    'Judul agenda wajib diisi.',

                'tanggal.required' =>
                    'Tanggal agenda wajib diisi.',

                'tanggal.date_format' =>
                    'Format tanggal agenda harus YYYY-MM-DD.',

                'waktu_mulai.required' =>
                    'Waktu mulai wajib diisi.',

                'waktu_mulai.date_format' =>
                    'Format waktu mulai harus HH:MM.',

                'waktu_selesai.date_format' =>
                    'Format waktu selesai harus HH:MM.',

                'waktu_selesai.after_or_equal' =>
                    'Waktu selesai harus setelah atau sama dengan waktu mulai.',

                'jenis.required' =>
                    'Jenis agenda wajib diisi.',
            ]
        );

        $agenda->update([
            'surat_masuk_id' =>
                $validated['surat_masuk_id'] ?? null,

            'judul' =>
                $validated['judul'],

            'tanggal' =>
                $validated['tanggal'],

            'waktu_mulai' =>
                $validated['waktu_mulai'],

            'waktu_selesai' =>
                $validated['waktu_selesai'] ?? null,

            'lokasi' =>
                $validated['lokasi'] ?? null,

            'jenis' =>
                $validated['jenis'],

            'keterangan' =>
                $validated['keterangan'] ?? null,
        ]);

        return redirect()
            ->route('sekretaris.agenda')
            ->with(
                'success',
                'Agenda berhasil diperbarui.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | HAPUS AGENDA
    |--------------------------------------------------------------------------
    */

    public function destroy(
        Agenda $agenda
    ): RedirectResponse {
        $agenda->delete();

        return redirect()
            ->route('sekretaris.agenda')
            ->with(
                'success',
                'Agenda berhasil dihapus.'
            );
    }
}