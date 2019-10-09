const dateToLiskEpochTimestamp = date => (
    Math.floor(new Date(date).getTime() / 1000) - Math.floor(new Date(Date.UTC(2016, 4, 24, 17, 0, 0, 0)).getTime() / 1000)
);

module.exports = {
    dateToLiskEpochTimestamp,
}