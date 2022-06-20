import { LikeAsset } from '../../../../../src/app/modules/post/assets/like_asset';

describe('LikeAsset', () => {
	let transactionAsset: LikeAsset;

	beforeEach(() => {
		transactionAsset = new LikeAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(3);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('like');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
			it.todo('should throw errors for invalid schema');
			it.todo('should be ok for valid schema');
		});
	});

	describe('apply', () => {
		describe('valid cases', () => {
			it.todo('should update the state store');
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
