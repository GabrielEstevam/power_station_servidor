let user = null;
let relays = []

const gId = (id) => {
    return document.getElementById(id);
}

const toggleRelay = (id) => {
    if(!user || relays.length == 0)
        return;
    
    console.log(user.credit, relays.find( relay => relay.id_relay == id))
}

const setRelays = (relays) => {
    if (!relays)
        return;
    if (relays.length < 1)
        return;
    
    const root = gId('relay-container');

    relays.map(relay => {
        const relayRow = document.createElement('div');
        relayRow.className += "relay row";
        relayRow.id = `relay-${relay.id_relay}`;

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
                if(relay.inUse == 1){
                    const infoTextNode = document.createTextNode('Tempo restante: ');
                    infoText.appendChild(infoTextNode);

                    const infoTextTime = document.createElement('span');
                    infoTextTime.id = `relay-time-${relay.id}`;
                        const infoTextTimeInner = document.createTextNode(`${relay.remainingTime} segundos`);
                        infoTextTime.appendChild(infoTextTimeInner);
                    infoText.appendChild(infoTextTime);
                }

                infoContent.appendChild(infoText);

                const infoButtonContainer = document.createElement('div');
                infoButtonContainer.className += 'd-flex';
                    const infoButton = document.createElement('button');
                    infoButton.className += 'relay-activation btn btn-primary m-auto';
                    infoButton.addEventListener('click', () => toggleRelay(relay.id_relay));
                        const infoButtonText = document.createTextNode((relay.inUse == 1) ? 'Ativar' : 'Desativar');
                        if(user.credit == 0){
                            infoButton.disabled = true;
                            infoButton.setAttribute('title', 'Você não tem créditos');
                        }
                        infoButton.appendChild(infoButtonText);
                    infoButtonContainer.appendChild(infoButton);
                infoContent.appendChild(infoButtonContainer);

            relayRow.appendChild(infoContent);

        root.appendChild(relayRow);
    });
}

window.onload = async () => {
    const idUser = localStorage.getItem("idUser");
    if(!idUser){
        window.location.href = "/";
    }

    const userResponse = await axios.get(`/user/${idUser}`)

    user = userResponse.data.user;
    gId("credits").textContent = user.credit;

    gId("hello-msg").textContent = "Você está logado como "+user.name;

    const relaysResponse = await axios.get('/relays');

    relays = relaysResponse.data;

    setRelays(relays);
}

gId("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("idUser");
    window.location.href = "/";
});

