const gId = (id) => {
    return document.getElementById(id);
}

const form = gId("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let user = gId("inputUser").value;
    let password = gId("inputPassword").value;

    let response = await axios.post('/login', { user, password });
    let { validation, id } = response.data;

    if(validation){
        localStorage.setItem("idUser", id);
        form.submit();
    }
    else{
        console.error("Unable to login");
    }
    
});