export interface RegisterAssetProps {
	name: string;
	ttl: number;
	registerFor: number;
}

export const registerAssetPropsSchema = {
  $id: 'lns/assets/register',
  title: 'RegisterAsset transaction asset for lns module',
  type: 'object',
  required: ['name', 'ttl', 'registerFor'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    ttl: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    registerFor: {
      dataType: 'uint32',
      fieldNumber: 3,
    },
  },
}