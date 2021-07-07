import { Button, Card, CardContent, Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import RegisterNameDialog from './transactions/RegisterNameDialog';

interface SearchResult {
	name: string;
	found: boolean;
}

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

const SearchResult: React.FC<SearchResult> = props => {
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	return (
		<React.Fragment>
			<Card>
				<CardContent>
					<div className={classes.cardContentArea}>
						<div className={classes.cardContentHeading}>
							<Typography variant={'h4'}>{props.name}</Typography>
						</div>

						<div>
							<Chip label={props.found ? 'Reserved' : 'Available'} variant="outlined" />
							{!props.found && (
								<Button size="small" color="primary" onClick={() => setOpen(true)}>
									Register
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<RegisterNameDialog
				name={props.name}
				open={open}
				fullWidth
				maxWidth={'sm'}
				onClose={() => setOpen(false)}
			/>
		</React.Fragment>
	);
};

export default SearchResult;
