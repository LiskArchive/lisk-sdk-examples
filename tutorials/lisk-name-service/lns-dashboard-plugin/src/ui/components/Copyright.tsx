import { Link, Typography } from '@material-ui/core';
import * as React from 'react';

const Copyright: React.FC = () => (
	<Typography variant="body2" color="textSecondary" align="center">
		{'Copyright © '}
		<Link color="inherit" href="https://lisk.io/">
			Lisk Foundation
		</Link>{' '}
		{new Date().getFullYear()}
		{'.'}
	</Typography>
);

export default Copyright;
