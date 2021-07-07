import { LNSNodeRecord, lnsNodeRecordSchema } from "../lns_node_record";

export interface UpdateRecordsAssetProps {
  name: string;
  records: LNSNodeRecord[];
}

export const updateRecordsAssetPropsSchema = {
  $id: 'lns/assets/update-records',
  title: 'Update Records transaction asset for lns module',
  type: 'object',
  required: ['records'],
  properties: {
    name: {
      dataType: 'string',
      fieldNumber: 1,
    },
    records: {
      type: 'array',
      fieldNumber: 2,
      items: {
				...lnsNodeRecordSchema,
			},
    }
  },
}