import { UpdateRecordsCommand } from '../../../../../src/app/modules/lns/commands/update_records_command';

describe('UpdateRecordsCommand', () => {
  let command: UpdateRecordsCommand;

	beforeEach(() => {
		command = new UpdateRecordsCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('updateRecords');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('execute', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
