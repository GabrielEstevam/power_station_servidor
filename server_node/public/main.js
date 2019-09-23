let user = null;

const gId = (id) => {
    return document.getElementById(id);
}

window.onload = async () => {
    const idUser = localStorage.getItem("idUser");
    if(!idUser){
        window.location.href = "/";
    }

    const response = await axios.get(`/user/${idUser}`)

    user = response.data.user;

    gId("hello-msg").textContent = "Hello "+user.name+"!";
}

gId("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("idUser");
    window.location.href = "/";
});
