import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactPage from '@/app/(public)/kontak/page';
import { pb } from '@/lib/pb';

// Mock PocketBase
jest.mock('@/lib/pb', () => ({
    pb: {
        collection: jest.fn(() => ({
            create: jest.fn().mockResolvedValue({ id: '123' }),
            getList: jest.fn().mockResolvedValue({ items: [] }), // For config check
            getFullList: jest.fn().mockResolvedValue([{ id: '1', name: 'Branch 1', type: 'Pusat' }]), // For branches
        })),
    },
}));

// Mock navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('Contact Page Integration', () => {
    it('submits the form successfully', async () => {
        render(<ContactPage />);

        // Wait for branches to load (optional but good practice)
        await waitFor(() => expect(screen.queryByText('Memuat data cabang...')).not.toBeInTheDocument());

        // Fill form
        fireEvent.change(screen.getByPlaceholderText('Nama Anda'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('08...'), { target: { value: '08123456789' } });
        fireEvent.change(screen.getByPlaceholderText('nama@email.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Tanya Produk / Layanan...'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByPlaceholderText('Tulis pesan atau pertanyaan Anda di sini...'), { target: { value: 'Test Message content that is long enough' } });

        // Submit
        fireEvent.click(screen.getByText('Kirim Pesan Sekarang'));

        // Wait for success
        await waitFor(() => {
            expect(screen.getByText('Pesan Terkirim!')).toBeInTheDocument();
        });

        // Verify API call
        expect(pb.collection).toHaveBeenCalledWith('inquiries');
        // Note: verify specific call arguments if possible, but mock implementation might need tweaking to spy on specific instances
    });


});
