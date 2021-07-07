import {
	Box,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@material-ui/core';
import * as React from 'react';
import TransactionsContext from '../contexts/TransactionsContext';
import LNSName from './LNSLabel';

const RecentTransactions: React.FC = () => {
	const transactions = React.useContext(TransactionsContext);

	return (
		<Box mt={4}>
			<Typography variant={'h5'}>Recent Transactions</Typography>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Sender</TableCell>
								<TableCell>ModuleID</TableCell>
								<TableCell>AssetID</TableCell>
								<TableCell>Fee</TableCell>
								<TableCell>Recipient</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{transactions.map(t => (
								<TableRow key={t.id}>
									<TableCell title={t.id}>{t.id.substr(0, 8)}...</TableCell>
									<TableCell>
										<LNSName publicKey={t.senderPublicKey} />
									</TableCell>
									<TableCell>{t.moduleID}</TableCell>
									<TableCell>{t.assetID}</TableCell>
									<TableCell>{t.fee}</TableCell>
									<TableCell>
										{t.moduleID === 2 && t.assetID === 0 && (
											<LNSName
												binaryAddress={(t.asset as { recipientAddress: string }).recipientAddress}
											/>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</Box>
	);
};

export default RecentTransactions;
