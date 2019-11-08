let user = null;
let relays = []
let socket = null;
let secondsCountdown = null;

const gId = (id) => {
    return document.getElementById(id);
}

const formatRemainingTime = (time) => {
    if(time < 60)
        return `${time} segundos`;
    else{
        let minutes = Math.ceil(time/60);
        let seconds = time%60;
        if(seconds !== 0)
            minutes--;
        return `${minutes}:${("0" + seconds).slice(-2)} minutos`;
    }
}

window.onload = async () => {
    const idUser = localStorage.getItem("idUser");
    if(!idUser){
        window.location.href = "/";
    }

    socket = io('http://192.168.137.159:3000', {
        query: { id_user: idUser }
    });
    defineSocketEvents();
    const userResponse = await axios.get(`/user/${idUser}`)

    user = userResponse.data.user;
    gId("credits").textContent = user.credit;

    gId("hello-msg").textContent = "Você está logado como "+user.name;

    const relaysResponse = await axios.get('/relays');

    relays = relaysResponse.data;

    setRelays(relays);

    secondsCountdown = setInterval(() => {
        for(let i = 0; i < relays.length; i++){
            if(relays[i].remainingTime > 0){
                relays[i].remainingTime -= 1;
                if(relays[i].remainingTime === 0){
                    relays[i].inUse = 0;
                    relays[i].id_user = 0;
                }
            }
            else
                relays[i].remainingTime = 0;
            let numberSpan = gId(`relay-time-${relays[i].id_relay}`);
            if(numberSpan)
                numberSpan.textContent = formatRemainingTime(relays[i].remainingTime);
        }
    }, 1000)
}

gId("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("idUser");
    window.location.href = "/";
});

const toggleRelay = async (id_relay, button) => {
    if(!user || relays.length == 0)
        return;
    button.disabled = true;

    let relay = relays.find( relay => relay.id_relay == id_relay);
    relay.index = relays.findIndex( actualRelay => actualRelay.id_relay == relay.id_relay );
    let id_user = user.id_user;

    if(relay.inUse === 0){
        let spentCredit = user.credit;

        //spends a maximum of 30 credits a time
        if(user.credit > 30){
            spentCredit = 30;
            user.credit -= 30;
        }
        else
            user.credit = 0;
    
        const response = await axios.post('/activateRelay', {
            id_relay,
            id_user,
            credit: spentCredit*60, // transforms minutes into seconds
        })
    
        if(response.data.success){
            button.disabled = '';
            
            await axios.post('/buyCredits', {idUser: id_user, time: (spentCredit)*(-1) })
            gId('credits').textContent = user.credit;
            if(user.credit <= 0){
                let buttons = document.getElementsByClassName('relay-activation');
                for(let i = 0; i < buttons.length; i++){
                    if(relays[i].id_user != id_user)     
                        buttons[i].disabled = true;
                }
            }
            reconstructRelayBlock(relay, id_user, 1, spentCredit*60);
            socket.emit('newActivation', relay)
        }
    }
    else if(relay.inUse === 1){
        if(relay.id_user === id_user){
            const response = await axios.post('/deactivateRelay',{
                id_relay,
                id_user,
            })

            if(response.data.success){
                button.disabled = '';
                let additionalCredits = Math.floor(relay.remainingTime/60);
                
                user.credit += additionalCredits;
                
                await axios.post('/buyCredits', {idUser: id_user, time: additionalCredits})
                gId('credits').textContent = user.credit;
                if(user.credit > 0){
                    let buttons = document.getElementsByClassName('relay-activation');
                    for(let i = 0; i < buttons.length; i++){
                        if(relays[i].inUse === 0)
                            buttons[i].disabled = '';
                    }
                }
                reconstructRelayBlock(relay, 0, 0, 0);
                socket.emit('newActivation', relay)
            }
        }
    }
}

const setRelays = (relays) => {
    if (!relays)
        return;
    if (relays.length < 1)
        return;
    
    const root = gId('relay-container');

    relays.map(relay => {
        const container = document.createElement('div');
        container.id = `relay-${relay.id_relay}`;
        container.appendChild(createRelayBlock(relay));

        root.appendChild(container);
    });
}

const reconstructRelayBlock = (relay, id_user, inUse, remainingTime) => {
    let container = gId(`relay-${relay.id_relay}`);

    if((id_user !== undefined) && (inUse !== undefined) && (remainingTime !== undefined)){
        relay.id_user = id_user;
        relay.inUse = inUse;
        relay.remainingTime = remainingTime;
    }
    else{
        relay.index = relays.findIndex( actualRelay => actualRelay.id_relay == relay.id_relay );
    }

    relays[relay.index] = relay;

    while(container.firstChild)
        container.removeChild(container.firstChild);
    container.appendChild(createRelayBlock(relay));
}

const createRelayBlock = (relay) => {

    const relayRow = document.createElement('div');
    relayRow.className += "relay row";

        const relayEnabled = document.createElement('div');
        relayEnabled.className += "col-2 p-3";

            const relayEnabledBtn = document.createElement('button');
            relayEnabledBtn.className += "relay-status";
            relayEnabledBtn.disabled = true;
            relayEnabledBtn.setAttribute("status", (relay.inUse == 1) ? "active" : "inactive");

            relayEnabled.appendChild(relayEnabledBtn);

        relayRow.appendChild(relayEnabled);

        const infoContent = document.createElement('div');
        infoContent.className += 'col p-3 d-flex flex-column';

            const infoText = document.createElement('p');
            if(relay.inUse == 1 && (relay.id_user === user.id_user)){
                const infoTextNode = document.createTextNode('Tempo restante: ');
                infoText.appendChild(infoTextNode);

                const infoTextTime = document.createElement('span');
                infoTextTime.id = `relay-time-${relay.id_relay}`;
                    const infoTextTimeInner = document.createTextNode(formatRemainingTime(relay.remainingTime));
                    infoTextTime.appendChild(infoTextTimeInner);
                infoText.appendChild(infoTextTime);
            }

            infoContent.appendChild(infoText);

            const infoButtonContainer = document.createElement('div');
            infoButtonContainer.className += 'd-flex';
                const infoButton = document.createElement('button');
                infoButton.className += 'relay-activation btn btn-primary m-auto';
                infoButton.addEventListener('click', (event) => toggleRelay(relay.id_relay, event.target));
                    const infoButtonText = document.createTextNode((relay.inUse == 0 || (relay.id_user !== user.id_user)) ? 'Ativar' : 'Desativar');
                    if((user.credit == 0 && relay.id_user != user.id_user) || (relay.id_user != user.id_user && relay.inUse == 1)){
                        infoButton.disabled = true;
                        infoButton.setAttribute('title', (user.credit == 0) ? 'Você não tem créditos' : 'Alguém está usando esta tomada');
                    }

                    infoButton.appendChild(infoButtonText);
                infoButtonContainer.appendChild(infoButton);
            infoContent.appendChild(infoButtonContainer);

        relayRow.appendChild(infoContent);
    return relayRow;
}

const defineSocketEvents = () => {
    socket.on('updateRelays', relay => reconstructRelayBlock(relay))
}