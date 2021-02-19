# Building Social Security System using Lisk SDK

## Description

The social security system or app is a recovery tool for users to get the access to their account for which they have lost their private key or passphrase. The recovery process is processed and protected by trusted “friends” who are required to gain access to the affected account to the original account owner. The original account owner sets a recovery configuration with a set of friends , minimum number of friends required and a delay period.

## Recovery Configuration
To make an account recoverable, the account sets 3 crucial parameters.
`friends`: List of all friend’s address
`recoveryThreshold`: Minimum number of friends required to give access.
`delayPeriod`: The minimum number of blocks required from the height at which account recovery was initiated to successfully recover the account.
`deposit`: This is automatically calculated using the base deposit amount along with the factor mutilplied by number of friends that you want to register.

## Recovery Life cycle

- Create recovery configuration: User setups its account with recovery configuration. User provides with `friends` addresses, `delayPeriod` and `recoveryThreshold`.
- Initiate recovery: This is the step only when user loses its passphrase to its account. User creates a transaction with lostAccount in its asset field through its new or some other account as a rescuer to initiate the recovery process. It debits the amount of deposit that was set in the lostAccount.
- Vouch recovery: In this step, user asks his friends that it trusted and configured in the recovery config of the lostAccount. Friends then vouch for the recovery. Friend adds its signature to the `vouchList` property.
- Claim recovery: After all the friends have vouched for the rescuer to recover the lostAccount, rescuer can claim the funds of the lostAccount along with the deposit. This can only be claimed if it passed its delayPeriod.
- Close recovery: User can stop any active recovery happening. If there is any malicious user trying to act as a rescuer then the deposit that was locked will be transferred to the user's account that was tried by maclicious user to recover.
- Remove recovery: User can completely remove recovery configuration that was setup anytime in the past and it will remove the config and transfer back the deposit to user's account.

## Module

`srs_module` consists of 6 types of assets of type of transactions that can be sent to invoke any of the above recovery life cycle functions.

### Account schema for `srs_module`

    srs: {
        config: {
            friends: array,
            recoveryThreshold: number,
            delayPeriod: number,
            deposit: bigint,
        },
        status: {
            rescuer: bytes,
            created: number,
            deposit: bigint,
            vouchList: array,
            active: boolean,
        }
    }

### Transaction assets

1. Create recovery: CreateRecoveryAsset
2. Initiate recovery: InitiateRecoveryAsset
3. Vouch recovery: VouchRecoveryAsset
4. Claim recovery: ClaimRecoveryAsset
5. Close recovery: CloseRecoveryAsset
6. Remove recovery: RemoveRecoveryAsset

## Plugin

`srs_plugin` has an api that creates and sends each type of srs transactions.

### API endpoints

1. POST `/api/recovery/create`: Body `{
    friends,
    delayPeriod,
    recoveryThreshold,
    passphrase
}`
2. POST `/api/recovery/initiate`: Body `{
    lostAccount,
    passphrase
}`
3. POST `/api/recovery/vouch`: Body {
    rescuer,
    lostAccount,
    passphrase
}`
4. POST `/api/recovery/claim`: Body `{
    lostAccount,
    passphrase
}`
5. POST `/api/recovery/close`: Body `{
    rescuer,
    passphrase
}`
6. POST `/api/recovery/remove`: Body `{
    passphrase
}`

## Run the app

To run the app, simply install using `npm i` and start the app using `npm start`.

You can call localhost:8080/api/{method} to access plugin and call the endpoints to call functions related to recovery process.