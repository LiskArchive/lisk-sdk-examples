export interface ReverseLookupAssetProps {
	name: string;
}

export const reverseLookupAssetPropsSchema = {
  $id: 'lns/assets/set-lookup',
  title: 'SetLookup transaction asset for lns module',
  type: 'object',
  required: ['name'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
  },
}