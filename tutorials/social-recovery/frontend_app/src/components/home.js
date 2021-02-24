import React from 'react';
import Typography from '@material-ui/core/Typography';

const description = `
The social security system or app is a recovery tool for users to get the access to their account for which they have lost their private key or passphrase. The recovery process is processed and protected by trusted “friends” who are required to gain access to the affected account to the original account owner. The original account owner sets a recovery configuration with a set of friends , minimum number of friends required and a delay period.
`

const recoveryConfig= `
To make an account recoverable, the account sets 3 crucial parameters.
friends: List of all friend’s address
recoveryThreshold: Minimum number of friends required to give access.
delayPeriod: The minimum number of blocks required from the height at which account recovery was initiated to successfully recover the account.
deposit: This is automatically calculated using the base deposit amount along with the factor mutilplied by number of friends that you want to register.`
export default function Home() {
    return (
        <div>
            <h1 align='left'>Social Recovery System</h1>
            <Typography align='left'>
                {description}
            </Typography>
            <br />
            <h3 align='left'>Setting up recovery configuration</h3>
            <Typography align='left'>
                {recoveryConfig}
            </Typography>
            <br />
            <h3 align='left'>Recovery life cycle</h3>
            <Typography align='left'>
                <ul>
                <li><b>Create recovery configuration:</b> User setups its account with recovery configuration. User provides with `friends` addresses, `delayPeriod` and `recoveryThreshold`.</li>
                <li><b>Initiate recovery:</b> This is the step only when user loses its passphrase to its account. User creates a transaction with lostAccount in its asset field through its new or some other account as a rescuer to initiate the recovery process. It debits the amount of deposit that was set in the lostAccount.</li>
                <li><b>Vouch recovery:</b> In this step, user asks his friends that it trusted and configured in the recovery config of the lostAccount. Friends then vouch for the recovery. Friend adds its signature to the `vouchList` property.</li>
                <li><b>Claim recovery:</b> After all the friends have vouched for the rescuer to recover the lostAccount, rescuer can claim the funds of the lostAccount along with the deposit. This can only be claimed if it passed its delayPeriod.</li>
                <li><b>Close recovery:</b> User can stop any active recovery happening. If there is any malicious user trying to act as a rescuer then the deposit that was locked will be transferred to the user's account that was tried by maclicious user to recover.</li>
                <li><b>Remove recovery:</b> User can completely remove recovery configuration that was setup anytime in the past and it will remove the config and transfer back the deposit to user's account.</li>
                </ul>
            </Typography>
        </div>
    );
}