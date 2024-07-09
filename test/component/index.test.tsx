import { render, screen } from '@testing-library/react';
import Home from '../../src/app/page';
import '@testing-library/jest-dom';
import App from 'next/app';

describe('Component testing', () => {
	it('<Home />', async () => {
		render(<Home />);

		const helloWorldText = await screen.findByText('Hello world');

		expect(helloWorldText).toBeInTheDocument();
	});
});
