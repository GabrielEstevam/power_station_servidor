const sql = require('./db');
const api = require('./src/api');

let relays = [];

const manageRelays = async (io) => {
    relays = (await sql.getRelays()).relays
    const loop = setInterval(async () => {
        for(let i = 0; i < relays.length; i++){
            if(relays[i].remainingTime > 0){
                relays[i].remainingTime -= 1;
                if(relays[i].remainingTime === 0){
                    relays[i].inUse = 0;
                    relays[i].id_user = 0;
                    await sql.updateRelay(relays[i]);
                    await api.post('/deactivateRelay', { id_relay: relays[i].id_relay });
                    io.emit('updateRelays', relays[i]);
                }
            }
            else
                relays[i].remainingTime = 0;
        }
    }, 1000)
}

const emitUpdate = (io, newRelay) => {
    let index = relays.findIndex(relay => relay.id_relay === newRelay.id_relay);
    relays[index] = newRelay;
    io.emit('updateRelays', newRelay)
}

module.exports = {
    manageRelays,
    emitUpdate,
};