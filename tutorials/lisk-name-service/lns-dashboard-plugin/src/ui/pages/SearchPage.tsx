import { Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import SearchResult from '../components/SearchResult';
import AppContext from '../contexts/AppContext';
import MainLayout from '../layouts/MainLayout';
import { normalizeName } from '../utils';

const SearchPage: React.FC = () => {
	const { client } = React.useContext(AppContext);
	const { term } = useParams<{ term: string }>();
	const [results, setResults] = React.useState<SearchResult[]>([]);
	const searchName = normalizeName(term);

	React.useEffect(() => {
		const run = async () => {
			try {
				await client.invoke('lns:resolveName', { name: searchName });
				setResults([{ name: searchName, found: true }]);
			} catch {
				setResults([{ name: searchName, found: false }]);
			}
		};

		run().catch(console.error);
	}, [searchName]);

	return (
		<MainLayout searchTerm={term}>
			<Box mt={2} mb={2}>
				<Typography variant={'h5'}>Search results...</Typography>
			</Box>

			{results.map(r => (
				<SearchResult key={r.name} {...r} />
			))}
		</MainLayout>
	);
};

export default SearchPage;
