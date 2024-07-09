'use client';

import {
	Container,
	Header,
	Grid,
	Button,
	Image,
	GridColumn,
} from 'semantic-ui-react';
import styles from './grid.module.css';
import Link from 'next/link';
import { BottomButton } from '../../components';

export default function Home() {
	return (
		<Container style={{ padding: '2em' }}>
			<Header as="h1" textAlign="center">
				Style Transfer
			</Header>
			<p style={{ textAlign: 'center' }}>
				Style transfer is a technique of recomposing images in the style
				of other images. It uses deep learning algorithms to apply the
				style of a reference image (like a famous painting) to the
				content of a different image, creating a unique blend of the
				two.
			</p>

			<Image
				src="https://miro.medium.com/v2/resize:fit:828/format:webp/0*bWkWBhe1HbidTTL6.png"
				centered
				fluid
			/>
			<div style={{ textAlign: 'center', marginTop: '2em' }}>
				<Link href="/styleselect">
					<BottomButton handleClick={()=>{}} disabled={false}>
						I Want to Try
					</BottomButton>
				</Link>
			</div>
		</Container>
	);
}
