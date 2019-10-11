let user = null;

const gId = (id) => {
    return document.getElementById(id);
}

window.onload = async () => {
    const idUser = localStorage.getItem("idUser");
    if(!idUser){
        window.location.href = "/";
    }

    const userResponse = await axios.get(`/user/${idUser}`)

    user = userResponse.data.user;
    gId("credits").textContent = user.credit;
}

gId("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("idUser");
    window.location.href = "/";
});

$('#buy_panel').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var value = button.data('value') // Extract info from data-* attributes
    var time = button.data('time') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-time').text(time)
    modal.find('.modal-value').text(value)
  })

gId("confirm-button").addEventListener("click", async() => {  //pega os valores do modal
    const time = parseInt (gId("modal-time").textContent);
    const idUser = localStorage.getItem("idUser");
    gId("confirm-button").disabled = true;

    const response =  await axios.post('/buyCredits', { // manda para a rota
        time,
        idUser
    });
    
    if(response.data.success){
        window.location.href = '/main'

    }
    else{
        console.error("Error update database", response.data.error)

    }

    console.log(response.data);
});