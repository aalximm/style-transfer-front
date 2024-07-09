'use server';

export interface StyleDto {
	style_key: string;
	name: string;
	description: string;
	image_url: string;
}

export async function loadStyleOptions(): Promise<StyleDto[]> {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_HOST;

	if (!backendUrl) {
		throw new Error('back url not found');
	}

	const response = await fetch(backendUrl + '/image-styler/styles', {
		method: 'GET',
	}).catch((e) => {
		throw e;
	});

	let result = (await response.json()) as StyleDto[];
	result = result.map((value) => {
		return {
			...value,
			image_url: backendUrl + value.image_url,
		};
	});

	return result;
}
