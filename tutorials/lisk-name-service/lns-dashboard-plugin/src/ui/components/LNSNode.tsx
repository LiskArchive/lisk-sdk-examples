import {
	Button,
	Card,
	CardActions,
	CardContent,
	Collapse,
	IconButton,
	MenuItem,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import { LNSNodeJSON, LNSNodeRecordJSON } from '../types';
import { toLocalTime } from '../utils';
import UpdateRecordsDialog from './transactions/UpdateRecordsDialog';

const useStyles = makeStyles(theme => ({
	card: {
		marginBottom: theme.spacing(3),
	},
	cardContentArea: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-end',
	},

	cardContentHeading: {
		flexGrow: 1,
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
	table: {
		minWidth: 200,
	},
}));

const LNSNode: React.FC<{ node: LNSNodeJSON }> = props => {
	const [updateDialog, setUpdateDialog] = React.useState(false);
	const [expanded, setExpanded] = React.useState(false);
	const [records, setRecords] = React.useState<LNSNodeRecordJSON[]>([
		...props.node.records,
		{ type: 1, label: '', value: '' },
		{ type: 1, label: '', value: '' },
		{ type: 1, label: '', value: '' },
	]);
	const classes = useStyles();

	const handleChangeRecord = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: keyof LNSNodeRecordJSON,
		index: number,
	) => {
		const updatedRecords = [...records];
		const record = { ...updatedRecords[index], [field]: event.target.value };
		updatedRecords[index] = record;
		setRecords(updatedRecords);
	};

	const handleUpdateRecords = () => {
		let updatedRecords = [...records];

		updatedRecords = updatedRecords.filter(r => !!r.value.trim());
		setRecords(updatedRecords);
		setUpdateDialog(true);
	};

	return (
		<Card className={classes.card}>
			<CardContent>
				<div className={classes.cardContentArea}>
					<div className={classes.cardContentHeading}>
						<Typography variant={'h4'}>{props.node.name}</Typography>
					</div>

					<div>
						<IconButton
							className={`${classes.expand} ${expanded ? classes.expandOpen : ''}`}
							onClick={() => setExpanded(!expanded)}
						>
							<ExpandMoreIcon />
						</IconButton>
					</div>
				</div>
			</CardContent>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<Typography variant={'h6'}>Details</Typography>

					<Table className={classes.table}>
						<TableBody>
							<TableRow>
								<TableCell>Registered</TableCell>
								<TableCell>
									<strong>{toLocalTime(props.node.createdAt)}</strong>
								</TableCell>
								<TableCell>Last Updated</TableCell>
								<TableCell>
									<strong>{toLocalTime(props.node.updatedAt)}</strong>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell>TTL</TableCell>
								<TableCell>
									<strong>{props.node.ttl}</strong>
								</TableCell>
								<TableCell>Expiry</TableCell>
								<TableCell>
									<strong>{toLocalTime(props.node.expiry)}</strong>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					<br />
					<Typography variant={'h6'}>Records</Typography>

					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell>Type</TableCell>
								<TableCell>Label</TableCell>
								<TableCell>Value</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{records.map((record, index) => (
								<TableRow key={index}>
									<TableCell>
										<TextField
											value={record.type}
											label={false}
											variant={'outlined'}
											select
											onChange={e => handleChangeRecord(e, 'type', index)}
										>
											<MenuItem value={1}>CNAME</MenuItem>
											<MenuItem value={2}>TXT</MenuItem>
										</TextField>
									</TableCell>
									<TableCell>
										<TextField
											value={record.label}
											label={false}
											variant={'outlined'}
											onChange={e => handleChangeRecord(e, 'label', index)}
											fullWidth
										/>
									</TableCell>
									<TableCell>
										<TextField
											value={record.value}
											label={false}
											variant={'outlined'}
											onChange={e => handleChangeRecord(e, 'value', index)}
											fullWidth
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
				<CardActions>
					<Button variant={'outlined'} color={'primary'} onClick={handleUpdateRecords}>
						Update Records
					</Button>

					<UpdateRecordsDialog name={props.node.name} records={records} open={updateDialog} />
				</CardActions>
			</Collapse>
		</Card>
	);
};

export default LNSNode;
