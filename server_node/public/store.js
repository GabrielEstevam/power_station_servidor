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