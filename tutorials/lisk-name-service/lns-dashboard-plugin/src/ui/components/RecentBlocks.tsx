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
import BlocksContext from '../contexts/BlocksContext';
import LNSName from './LNSLabel';

const RecentBlocks: React.FC = () => {
	const blocks = React.useContext(BlocksContext);

	return (
		<Box mt={4}>
			<Typography variant={'h5'}>Recent Blocks</Typography>
			<Card>
				<CardContent>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>ID</TableCell>
								<TableCell>Height</TableCell>
								<TableCell>Timestamp</TableCell>
								<TableCell>Generator</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{blocks.map(b => (
								<TableRow key={b.header.id}>
									<TableCell title={b.header.id}>{b.header.id.substr(0, 8)}...</TableCell>
									<TableCell>{b.header.height}</TableCell>
									<TableCell>{b.header.timestamp}</TableCell>
									<TableCell>
										<LNSName publicKey={b.header.generatorPublicKey} />
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

export default RecentBlocks;
