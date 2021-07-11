import useSWR from 'swr';

interface PresenceResponse {
	data: string | null;
	error: string | null;
}

/**
 *
 * @param data The data which is parameters which is used to send a fetch request to the api.
 * @param data.platform The platform name, ex. "twitter".
 * @param data.type The type of data, ex. "user", a full list can be found on [docs.presence.im](https://docs.presence.im).
 * @param data.param The parameter, usually the username or id, ex. "atmattt".
 * @param data.queries Optional query parameters, ex. ["type=base64", "theme-dark"].
 */
export async function usePresence(data: {platform: string; type: string; param: string; queries?: string | string[]}) {
	const queries: string = data.queries ? Array.isArray(data.queries) ? `${data.queries.join('&')}` : `${data.queries}` : '';

	const {data: request, error: swrError} = useSWR(`https://presence.im/api/${data.platform}/${data.type}/${data.param}${queries}`);
	const headers = request.headers.get('Content-Type');

	const response: () => PresenceResponse | Blob | null = () => {
		switch (headers?.toLowerCase()) {
			case 'application/json; charset=utf-8':
				return request.json() as PresenceResponse;
			case 'image/svg+xml; charset=utf-8':
				return request.blob();
			case 'image/png; charset=utf-8':
				return request.blob();
			default:
				return null;
		}
	};

	const error: () => PresenceResponse | false = () => {
		return swrError || request.status === 500 ? request.json() as PresenceResponse : false;
	};

	const isLoading = !data && !swrError;

	return {data: response(), error: error(), isLoading};
}
