import { render, screen } from '@testing-library/react';
import { NewsCard } from '@/components/news/news-card';

// Mock next/image because it's tricky in tests
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />
    },
}));

describe('NewsCard', () => {
    const mockProps = {
        title: "Test News Title",
        slug: "test-news-slug",
        date: "10 Januari 2024",
        category: "Teknologi",
        excerpt: "This is a test excerpt.",
        thumbnail: "/test-image.jpg"
    };

    it('renders title and excerpt', () => {
        render(<NewsCard {...mockProps} />);
        expect(screen.getByText("Test News Title")).toBeInTheDocument();
        expect(screen.getByText("This is a test excerpt.")).toBeInTheDocument();
    });

    it('renders date and category', () => {
        render(<NewsCard {...mockProps} />);
        expect(screen.getByText("10 Januari 2024")).toBeInTheDocument();
        expect(screen.getByText("Teknologi")).toBeInTheDocument();
    });

    it('links to the correct slug', () => {
        render(<NewsCard {...mockProps} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/berita/test-news-slug');
    });
});
