import { ReverseLookupCommand } from '../../../../../src/app/modules/lns/commands/reverse_lookup_command';

describe('ReverseLookupCommand', () => {
  let command: ReverseLookupCommand;

	beforeEach(() => {
		command = new ReverseLookupCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toEqual('reverseLookup');
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
