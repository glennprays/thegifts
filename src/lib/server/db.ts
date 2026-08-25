import { getRequestEvent } from '$app/server';

/**
 * Get the D1 database binding for the current request.
 */
export function db() {
	const { platform } = getRequestEvent();
	if (!platform?.env?.DB) {
		throw new Error('D1 binding "DB" is not available');
	}
	return platform.env.DB;
}

export interface AssessmentRow {
	id: string;
	name: string;
	answer: string;
	result: string;
	createdAt: string;
	short_id: string | null;
}
