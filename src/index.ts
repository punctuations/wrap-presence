import useSWR from 'swr';
import axios from 'axios';

interface PresenceResponse {
	data: string | null;
	error: string | null;
}

/**
 * Use Presence
 * @param data The data which is parameters which is used to send a fetch request to the api.
 * @param data.platform The platform name, ex. "twitter".
 * @param data.type The type of data, ex. "user", a full list can be found on [docs.presence.im](https://docs.presence.im).
 * @param data.param The parameter, usually the username or id, ex. "atmattt".
 * @param data.queries Optional query parameters, ex. ["type=base64", "theme-dark"].
 */
export function usePresence(data: {platform: string; type: string; param: string; queries?: string | string[]}) {
	const queries: string = data.queries ? Array.isArray(data.queries) ? `?${data.queries.join('&')}` : `?${data.queries}` : '';

	const {data: request, error: swrError} = useSWR(`https://presence.im/api/${data.platform}/${data.type}/${data.param}${queries}`, url => axios.head(url));
	const headers = request?.headers['content-type'];

	const response: () => PresenceResponse | Blob | null = () => {
		switch (headers) {
			case 'application/json; charset=utf-8':
				return request?.data.json() as PresenceResponse;
			case 'image/svg+xml; charset=utf-8':
				return request?.data as Blob
			case 'image/png; charset=utf-8':
				return request?.data as Blob
			default:
				return null;
		}
	};

	const error: () => PresenceResponse | false = () => {
		return swrError || request?.status === 500 ? request?.data as PresenceResponse : false;
	};

	const isLoading = !data && !swrError;

	return {data: response(), error: error(), isLoading};
}
