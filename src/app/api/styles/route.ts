import { tryToPerform } from '@/utils/async.util';
import { NextRequest, NextResponse } from 'next/server';

export const queryKey = 'imagePath';

export async function GET(request: NextRequest) {
	const backendUrl = process.env.NEXT_PUBLIC_BACKEND_HOST;
	const imagePathEncoded = request.nextUrl.searchParams.get(queryKey);

	if (!backendUrl || !imagePathEncoded) {		
		return ServerError();
	}

	const imagePath = decodeURI(imagePathEncoded);

	const image = await tryToPerform(async () => {
		return await fetch(backendUrl + imagePath);
	});

	if (!image.success) {
		return ServerError();
	}

	const blob = await image.result.blob();

	return new Response(blob);
}

const ServerError: () => NextResponse = () => {
	return NextResponse.json(
		{ error: 'Internal Server Error' },
		{ status: 500 },
	);
};
