const gId = (id) => {
    return document.getElementById(id);
}

const form = gId("form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let user = gId("inputUser").value;
    let name = gId("inputName").value;
    let password = gId("inputPassword").value;
    let passwordConfirm = gId("inputPasswordConfirm").value;

    if(password !== passwordConfirm)
        gId('inputPassword').setCustomValidity('Senhas não correspondem');
    else
        gId('inputPassword').setCustomValidity('');

    if(form.checkValidity() === false)
        return;

    let response = await axios.post('/validateSignin', { name, user, password });
    let { validation, error } = response.data;

    console.log(validation, error);

    if(validation){
        gId('inputUser').setCustomValidity('');
        form.className += "was-validated";
        form.submit();
    }
    else{
        gId('inputUser').setCustomValidity('Usuário já existe');
        console.error("Unable to sign", validation.error ? validation.error : '');
    }
    
});