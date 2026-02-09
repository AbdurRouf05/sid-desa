import { render, screen, fireEvent } from '@testing-library/react';
import { TactileButton } from '@/components/ui/tactile-button';

describe('TactileButton', () => {
    it('renders children correctly', () => {
        render(<TactileButton>Click Me</TactileButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<TactileButton onClick={handleClick}>Click Me</TactileButton>);
        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes', () => {
        render(<TactileButton variant="secondary">Secondary</TactileButton>);
        const button = screen.getByText('Secondary').closest('button');
        // Check for specific class from secondary variant
        expect(button).toHaveClass('from-yellow-300');
    });
});
