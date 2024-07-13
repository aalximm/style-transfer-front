'use client';

import {
	Header,
	Dimmer,
	Loader,
	Icon,
	DropdownItemProps,
	DropdownProps,
} from 'semantic-ui-react';
import {
	FileUploader,
	ImageView,
	BottomButton,
	ResultModal,
	StyleSelect,
	GridContainer,
} from '../../../components';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadStyleOptions } from '../actions/back.loader';
import { tryToPerform } from '@/utils/async.util';
import { IMAGE_QUERY_KEY } from '@/constants/network.constant';

export default function StyleSelectPage() {
	const [imageUrls, setImageUrls] = useState<{
		content?: string;
		result?: string;
	}>({});
	const [styleKey, setStyleKey] = useState<string>();
	const [loading, setLoading] = useState(false);
	const [resultOpen, setResultOpen] = useState(false);

	const [options, setOptions] = useState<DropdownItemProps[]>([]);
	const [imageUrlMap, setImageUrlMap] = useState<Map<string, string>>();
	const [activeStyleKey, setActiveStyleKey] = useState<string>();
	const [isFetching, setIsFetching] = useState<boolean>(true);
	const [fetchingError, setFetchingError] = useState<boolean>(false);

	const handleChange: (
		event: React.SyntheticEvent<HTMLElement>, // eslint-disable-line no-unused-vars
		data: DropdownProps, // eslint-disable-line no-unused-vars
	) => void = (_, props) => {
		const option = props.options?.filter((v) => v.value == props.value)[0];

		if (!option) {
			return;
		}

		setActiveStyleKey(props.value as string);
		setStyleKey(props.value as string);
	};

	useEffect(() => {
		const fetchOptions = async () => {
			const response = await tryToPerform(loadStyleOptions);

			if (!response.success) {
				setFetchingError(true);
				setIsFetching(false);
				return;
			}

			const responseBody = response.result;

			const tempOptions: DropdownItemProps[] = [];
			const tempImgUrlMap: Map<string, string> = new Map();

			for (const style of responseBody) {
				const option: DropdownItemProps = {
					text: style.name,
					key: style.style_key,
					value: style.style_key,
					content: (
						<>
							<p>{style.name}</p>
							<p style={{ fontSize: 12 }}>
								<i> - {style.description}</i>
							</p>
						</>
					),
				};

				const searchParams = new URLSearchParams();
				searchParams.set(IMAGE_QUERY_KEY, encodeURI(style.image_url));

				const image = await tryToPerform(async () => {
					const imageResponse = await fetch(
						'/api/styles?' + searchParams.toString(),
					).catch((e) => {
						console.log(e);

						return Promise.reject(e);
					});

					const blob = await imageResponse.blob();
					const blob_url = URL.createObjectURL(blob);
					return blob_url;
				});

				if (image.success) {
					tempOptions.push(option);
					tempImgUrlMap.set(style.style_key, image.result);
				}
			}

			if (tempOptions.length == 0) {
				setFetchingError(true);
				setIsFetching(false);
				return;
			}

			setOptions(tempOptions);
			setImageUrlMap(tempImgUrlMap);

			setStyleKey(tempOptions[0].key);

			setActiveStyleKey(tempOptions[0].key);

			setIsFetching(false);
		};

		fetchOptions();
	}, []);

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

		const response = await fetch(backendUrl + '/image-styler/upload', {
			method: 'POST',
			body: formData,
		}).catch((e) => {
			setLoading(false);
			return e;
		});

		if (response.status != 200) {
			setLoading(false);
			return;
		}

		const taskId = (await response.json())['task_id'];

		let pooling = true;

		while (pooling) {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			let result = await fetch(
				backendUrl + `/image-styler/result/${taskId}`,
			).catch((e) => {
				setLoading(false);
				pooling = false;
				return Promise.reject<Response>(e);
			});

			if (result.status == 202) {
				continue;
			} else if (result.status == 200) {
				const blob = await result.blob();
				const blobUrl = URL.createObjectURL(blob);

				setFile('result', blobUrl);
				setLoading(false);
				setResultOpen(true);
				pooling = false;
			} else {
				setLoading(false);
				pooling = false;

				throw new Error('Server Error');
			}
		}
	};

	return (
		<>
			<Header as="h1" textAlign="center">
				<Header.Content>
					Style Tranfer
					<Header.Subheader>
						Choose content and style photos and watch what will
						happen
						<Link href="/">
							<Icon link name="question circle" />
						</Link>
					</Header.Subheader>
				</Header.Content>
			</Header>
			<Dimmer active={loading} page>
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
				topRightContent={
					<StyleSelect
						options={options}
						imageUrl={
							activeStyleKey && imageUrlMap
								? imageUrlMap.get(activeStyleKey)
								: undefined
						}
						activeDropdownValue={activeStyleKey}
						isFetching={isFetching}
						fetchingError={fetchingError}
						handleChange={handleChange}
					/>
				}
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
				open={resultOpen}
				close={() => {
					deleteFile('result');
					setResultOpen(false);
				}}
				title="Result"
				description="You can download resulted image or try another styles"
				imageUrl={imageUrls.result!}
			/>
		</>
	);
}
