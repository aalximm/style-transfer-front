import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'semantic-ui-css/semantic.min.css';
import cn from 'classnames';

import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Style Transfer App',
	description: 'style transfer app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={cn(inter.className, styles.Body)}>{children}</body>
		</html>
	);
}
