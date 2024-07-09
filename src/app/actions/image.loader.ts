'use client';

import { cache } from 'react';

export const getImage = cache(async (imageUrl: string) => {
	const response = await fetch(imageUrl, {cache: 'force-cache'});
	const blob = await response.blob();
	const blobUrl = URL.createObjectURL(blob);

	return blobUrl;
});
