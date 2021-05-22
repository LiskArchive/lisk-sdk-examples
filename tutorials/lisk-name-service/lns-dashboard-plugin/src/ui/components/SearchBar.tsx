import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},

	'Input-lg': {
		fontSize: '2rem',
	},
}));

interface SearchBarProps {
	term?: string;
	large?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = props => {
	const [term, setTerm] = React.useState(props.term ?? '');
	const history = useHistory();
	const classes = useStyles();

	const handleSearch = (event: React.FormEvent) => {
		if (term.trim() !== '') {
			history.push(`/search/${term}`);
		}
		event.preventDefault();
	};

	return (
		<Paper component="form" className={classes.root} onSubmit={handleSearch}>
			<InputBase
				className={`${classes.input} ${props.large ? classes['Input-lg'] : ''}`}
				value={term}
				placeholder="Search Lisk Names"
				onChange={event => setTerm(event.target.value)}
			/>
			<IconButton type="submit" className={classes.iconButton}>
				<SearchIcon />
			</IconButton>
		</Paper>
	);
};

export default SearchBar;
