<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\DisposisiPesan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DisposisiPesanController extends Controller
{
    private function authorizeSekretaris(
        Disposisi $disposisi
    ): void {
        abort_unless(
            Auth::user()?->role?->slug === 'sekretaris-direktur',
            403,
            'Anda tidak memiliki akses ke percakapan ini.'
        );

        abort_if(
            $disposisi->tujuan_type !== 'unit',
            403,
            'Percakapan ini bukan disposisi untuk unit.'
        );
    }

    private function authorizeUnit(
        Disposisi $disposisi
    ): void {
        $user = Auth::user();

        abort_unless(
            $user?->unit_id &&
            (int) $user->unit_id === (int) $disposisi->ke_unit_id &&
            $disposisi->tujuan_type === 'unit',
            403,
            'Anda tidak memiliki akses ke percakapan ini.'
        );
    }

    private function validateRequest(
        Request $request
    ): array {
        return $request->validate(
            [
                'pesan' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],

                'file_pdf' => [
                    'nullable',
                    'file',
                    'mimes:pdf',
                    'mimetypes:application/pdf',
                    'max:10240',
                ],
            ],
            [
                'pesan.max' =>
                    'Pesan maksimal 5000 karakter.',

                'file_pdf.file' =>
                    'Lampiran tidak valid.',

                'file_pdf.mimes' =>
                    'Lampiran harus berupa PDF.',

                'file_pdf.mimetypes' =>
                    'Lampiran harus berupa file PDF.',

                'file_pdf.max' =>
                    'Ukuran PDF maksimal 10 MB.',
            ]
        );
    }

    private function saveMessage(
        Request $request,
        Disposisi $disposisi
    ): ?string {
        $validated = $this->validateRequest($request);

        $pesan = trim(
            (string) ($validated['pesan'] ?? '')
        );

        $hasFile = $request->hasFile('file_pdf');

        /*
        |--------------------------------------------------------------------------
        | Jangan lempar halaman error Laravel
        |--------------------------------------------------------------------------
        */
        if ($pesan === '' && !$hasFile) {
            return 'Tulis pesan atau lampirkan file PDF terlebih dahulu.';
        }

        /*
        |--------------------------------------------------------------------------
        | Buat data pesan
        |--------------------------------------------------------------------------
        */
        $data = [
            'disposisi_id' => $disposisi->id,
            'user_id' => Auth::id(),
            'pesan' => $pesan !== ''
                ? $pesan
                : null,
        ];

        /*
        |--------------------------------------------------------------------------
        | Simpan PDF jika ada
        |--------------------------------------------------------------------------
        */
        if ($hasFile) {
            $file = $request->file('file_pdf');

            $path = $file->store(
                'disposisi-pesan',
                'public'
            );

            $data['file_pdf'] =
                $path;

            $data['file_nama'] =
                $file->getClientOriginalName();

            $data['file_mime'] =
                $file->getMimeType();

            $data['file_size'] =
                $file->getSize();
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan pesan sebagai record baru
        |--------------------------------------------------------------------------
        */
        DisposisiPesan::create($data);

        /*
        |--------------------------------------------------------------------------
        | Pesan pertama otomatis mengubah status
        |--------------------------------------------------------------------------
        */
        if ($disposisi->status === 'terkirim') {
            $disposisi->update([
                'status' => 'in_progress',
            ]);
        }

        return null;
    }

    public function storeSekretaris(
        Request $request,
        Disposisi $disposisi
    ): RedirectResponse {
        $this->authorizeSekretaris(
            $disposisi
        );

        /*
        |--------------------------------------------------------------------------
        | Tidak boleh kirim setelah selesai
        |--------------------------------------------------------------------------
        */
        if ($disposisi->status === 'selesai') {
            return back()->withErrors([
                'pesan' =>
                    'Disposisi yang sudah selesai tidak dapat menerima pesan baru.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan pesan
        |--------------------------------------------------------------------------
        */
        $error = $this->saveMessage(
            $request,
            $disposisi
        );

        if ($error) {
            return back()->withErrors([
                'pesan' => $error,
            ]);
        }

        return back()->with(
            'success',
            'Balasan berhasil dikirim.'
        );
    }

    public function storeUnit(
        Request $request,
        Disposisi $disposisi
    ): RedirectResponse {
        $this->authorizeUnit(
            $disposisi
        );

        /*
        |--------------------------------------------------------------------------
        | Tidak boleh kirim setelah selesai
        |--------------------------------------------------------------------------
        */
        if ($disposisi->status === 'selesai') {
            return back()->withErrors([
                'pesan' =>
                    'Disposisi yang sudah selesai tidak dapat menerima pesan baru.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Simpan pesan
        |--------------------------------------------------------------------------
        */
        $error = $this->saveMessage(
            $request,
            $disposisi
        );

        if ($error) {
            return back()->withErrors([
                'pesan' => $error,
            ]);
        }

        return back()->with(
            'success',
            'Pesan berhasil dikirim.'
        );
    }
}