export type PerformResult<T> =
	| { success: true; result: T }
	| { success: false };

export async function tryToPerform<T>(
	action: () => Promise<T>,
): Promise<PerformResult<T>> {
	try {
		const result: T = await action();
		return {
			success: true,
			result: result,
		};
	} catch (e) {
		return {
			success: false,
		};
	}
}