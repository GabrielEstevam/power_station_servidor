const sql = require('./db');

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

const activeRelay = (id_relay, id_user) => {
    relays[id_relay].inUse = 1
    relays[id_relay].id_user = id_user
}

module.exports = {
    manageRelays,
    emitUpdate,
    activeRelay,
};