import { Box, Button, Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import LNSNode from '../components/LNSNode';
import UpdateReverseLookupDialog from '../components/transactions/UpdateReverseLookupDialog';
import AppContext from '../contexts/AppContext';
import UserContext from '../contexts/UserContext';
import MainLayout from '../layouts/MainLayout';
import { Account, LNSNodeJSON } from '../types';

const useStyles = makeStyles(() => ({
	cardContentArea: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end',
	},

	cardContentHeading: {
		flexGrow: 1,
	},
}));

const MyAccount: React.FC = () => {
	const classes = useStyles();
	const { user, connected } = React.useContext(UserContext);
	const { client } = React.useContext(AppContext);
	const [myAccount, setMyAccount] = React.useState<Account | undefined>(undefined);
	const [myNodes, setMyNodes] = React.useState<LNSNodeJSON[]>([]);
	const [reverseNode, setReverseNode] = React.useState<LNSNodeJSON | undefined>(undefined);
	const [updateReverseNameDialog, setUpdateReverseNameDialog] = React.useState(false);

	React.useEffect(() => {
		const run = async () => {
			try {
				const acc = ((await client.account.get(
					Buffer.from(user.address, 'hex'),
				)) as unknown) as Account;
				setMyAccount(acc);

				for (const nodeHash of acc.lns.ownNodes) {
					const node = await client.invoke<LNSNodeJSON>('lns:resolveNode', {
						node: nodeHash.toString('hex'),
					});
					setMyNodes(currentNodes => [...currentNodes, node]);
				}

				if (acc.lns.reverseLookup) {
					const node = await client.invoke<LNSNodeJSON>('lns:resolveNode', {
						node: acc.lns.reverseLookup.toString('hex'),
					});
					setReverseNode(node);
				}
			} catch {
				console.error('Error fetching account', user);
			}
		};

		if (client) {
			run().catch(console.error);
		}
	}, [client, connected]);

	return (
		<MainLayout>
			{connected && myAccount && (
				<React.Fragment>
					<Box mt={2} mb={2} className={classes.cardContentArea}>
						<Typography variant={'h4'} className={classes.cardContentHeading}>
							My Domains
						</Typography>

						<div>
							<Button
								variant={'outlined'}
								color={'primary'}
								onClick={() => setUpdateReverseNameDialog(true)}
							>
								Update Reverse Lookup
							</Button>

							<UpdateReverseLookupDialog
								open={updateReverseNameDialog}
								existingName={reverseNode ? reverseNode.name : ''}
								newNames={myNodes.map(n => n.name)}
								maxWidth={'sm'}
								fullWidth={true}
							/>
						</div>
					</Box>

					<Box mt={2} mb={2}>
						<Card>
							<CardContent>
								<pre>{JSON.stringify(client.account.toJSON(myAccount as never))}</pre>
							</CardContent>
						</Card>
					</Box>

					{myNodes.map(n => (
						<LNSNode key={n.name} node={n} />
					))}
				</React.Fragment>
			)}
		</MainLayout>
	);
};

export default MyAccount;
