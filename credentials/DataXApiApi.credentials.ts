import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DataXApiApi implements ICredentialType {
	name = 'dataXApiApi';

	displayName = 'DataXAPI API';

	icon: Icon = { light: 'file:../icons/dataxapi.svg', dark: 'file:../icons/dataxapi.dark.svg' };

	documentationUrl = 'https://github.com/data-x-api/n8n-nodes-dataxapi#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your DataXAPI key, starting with dx_. Create one at https://dataxapi.com/console/keys/?ref=n8n.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	// GET /v1/account is free and needs the key, so the test costs nothing.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.dataxapi.com',
			url: '/v1/account',
			method: 'GET',
			headers: {
				'X-Source': 'n8n',
			},
		},
	};
}
