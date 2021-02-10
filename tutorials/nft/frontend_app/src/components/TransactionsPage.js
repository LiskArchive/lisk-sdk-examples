import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { getAllTransactions } from "../api";
import { cryptography, Buffer } from '@liskhq/lisk-client';

const columns = [
  { id: 'moduleName', label: 'ModuleName', minWidth: 100, maxWidth: 50 },
  { id: 'assetName', label: 'AssetName', minWidth: 100, maxWidth: 50 },
  { id: 'address', label: 'Address', minWidth: 170, maxWidth: 50 },
  { id: 'id', label: 'TransactionID', minWidth: 170, maxWidth: 50 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

export default function TransactionsPage() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [Transactions, setTransactions] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      setTransactions(await getAllTransactions());
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    let base32UIAddress;
                    let value;
                    if (row['recipientAddress']) {
                      base32UIAddress = cryptography.getBase32AddressFromAddress(Buffer.from(row['recipientAddress'], 'hex'));
                      value = base32UIAddress;
                    } else if (row['senderPublicKey']) {
                      base32UIAddress = cryptography.getBase32AddressFromPublicKey(Buffer.from(row['senderPublicKey'], 'hex'), 'lsk').toString('binary');
                      value = base32UIAddress;
                    }
                    value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {
                          column.format && typeof value === 'number' ? column.format(value) :
                            (column.id === 'address' ? base32UIAddress : value)
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={Transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
