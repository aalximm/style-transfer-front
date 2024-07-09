'use client';

import { Header, Grid, Dimmer, Loader } from 'semantic-ui-react';
import {
	FileUploader,
	ImageView,
	BottomButton,
	ResultModal,
	StyleSelect,
	GridContainer,
} from '../../../components';
import { useState } from 'react';

import styles from './selectorpage.module.css';

export default function StyleSelectPage() {
	const [imageUrls, setImageUrls] = useState<{
		content?: string;
		result?: string;
	}>({});
	const [styleKey, setStyleKey] = useState<string>();

	const [loading, setLoading] = useState(false);

	type ImageKey = keyof typeof imageUrls;

	const setFile = (imageType: ImageKey, url: string | undefined) => {
		setImageUrls((urls) => ({
			...urls,
			[imageType]: url,
		}));
	};

	const getFile = async (imageType: ImageKey) => {
		const url = imageUrls[imageType]!;

		return await fetch(url).then((r) => r.blob());
	};

	const deleteFile = (imageType: ImageKey) => {
		const url = imageUrls[imageType];

		if (url) {
			URL.revokeObjectURL(url);
			setFile(imageType, undefined);
		}

		return;
	};

	const sendFiles = async () => {
		setLoading(true);
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_HOST;

		if (!(backendUrl && imageUrls.content && styleKey)) {
			return;
		}

		const formData = new FormData();
		formData.append('content', await getFile('content'));
		formData.append('style', styleKey);

		const response = await fetch(
			backendUrl + '/image-styler/forward/upload',
			{
				method: 'POST',
				body: formData,
			},
		).catch((e) => {
			setLoading(false);
			return Promise.reject<Response>(e);
		});

		const blob = await response.blob();
		const blobUrl = URL.createObjectURL(blob);

		setFile('result', blobUrl);
		setLoading(false);

		// deleteFile('content')
		// deleteFile('style')
	};

	return (
		<>
			<Header as="h1" textAlign="center">
				<Header.Content>
					Style Tranfer App
					<Header.Subheader>
						Choose content and style photos and watch what will
						happen
					</Header.Subheader>
				</Header.Content>
			</Header>
			<Dimmer active={loading}>
				<Loader indeterminate>Preparing Files</Loader>
			</Dimmer>
			<GridContainer
				topLeftContent={
					imageUrls.content === undefined ? (
						<FileUploader
							description='Upload the "Content" Image'
							buttonText="Choose"
							setImageUrl={(url) => setFile('content', url)}
						/>
					) : (
						<ImageView
							imageUrl={imageUrls.content}
							deleteImage={() => deleteFile('content')}
						/>
					)
				}
				topRightContent={<StyleSelect setStyleKey={setStyleKey} />}
				bottomContent={
					<BottomButton
						disabled={!imageUrls.content || styleKey === undefined}
						handleClick={sendFiles}
					>
						Send File
					</BottomButton>
				}
			/>

			<ResultModal
				open={imageUrls.result !== undefined}
				// open
				close={() => {
					deleteFile('result');
				}}
				title="Result"
				description="You can download resulted image or try another styles"
				imageUrl={imageUrls.result!}
			/>
		</>
	);
}
