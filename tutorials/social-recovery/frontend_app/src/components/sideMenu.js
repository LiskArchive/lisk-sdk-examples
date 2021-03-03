import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { green, blue, orange, purple, red, brown } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import StopTwoToneIcon from '@material-ui/icons/StopTwoTone';
import { Divider } from '@material-ui/core/'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DvrIcon from '@material-ui/icons/Dvr';

const menuItems = [
    { key: 'create', text: 'Setup Recovery', icon: <EnhancedEncryptionIcon style={{ color: green[500] }}/> },
    { key: 'initiate', text: 'Initiate Recovery', icon: <DoubleArrowIcon style={{ color: blue[500] }} />},
    { key: 'vouch', text: 'Vouch For Friend', icon: <HowToVoteIcon style={{ color: orange[500] }} />},
    { key: 'claim', text: 'Claim Lost Account', icon: <SettingsBackupRestoreIcon  style={{ color: purple[500] }} />},
    { key: 'close', text: 'Close Recovery', icon: <StopTwoToneIcon style={{ color: brown[500] }} />},
    { key: 'remove', text: 'Remove Recovery', icon: <HighlightOffIcon style={{ color: red[500] }} />}
];

const secondaryMenu = [
    { key: 'account', text: 'Get Account', icon: <AccountCircleIcon style={{ color: green[500] }}/> },
    { key: 'nodeInfo', text: 'Get Node Info', icon: <DvrIcon style={{ color: blue[500] }} />},
    { key: 'recoveryAccounts', text: 'Get Recovery Accounts', icon: <DvrIcon style={{ color: blue[500] }} />},
];

const useStyles = makeStyles(() => ({
    button: {
      width: '95%',
      background: 'white',
      border:'0px'
    },
  }));

export default function SideMenu() {
    const classes = useStyles();
    return (
        <div>
            <List>
                {menuItems.map((item) => (
                    <Link to={item.key}>
                        <button type='button' className={classes.button}>
                            <ListItem button key={item.key}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </button>
                    </Link>
                ))}
            </List>
            <Divider />
            <List>
                {secondaryMenu.map((item) => (
                    <Link to={item.key}>
                        <button type='button' className={classes.button}>
                            <ListItem button key={item.key}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        </button>
                    </Link>
                ))}
            </List>
            <div className="border" />
        </div>
    );
}
