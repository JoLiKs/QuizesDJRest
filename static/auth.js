let modal = document.getElementById("modal-auth");
const form = document.getElementById('auth-form');
const login = document.getElementById('login');
let span = document.getElementsByClassName("close")[0];
const registrationBtn = document.getElementById("signup");
let email = document.getElementById("email");

span.onclick = function () {
    modal.style.display = "none";
}


function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

try {
    let loginBtn = document.getElementById("login-btn");

    loginBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
} catch (e) {
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', () => {
        $.ajax({
            url: '/user/logout/',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    window.location.href = 'http://127.0.0.1:8000/'
                } else {
                    alert('Вы не авторизованы!')
                }
            },
            error: function (xhr, status, error) {
            }
        });
    })
}

login.addEventListener('click', async (e) => {
    e.preventDefault();
    if (email.style.visibility === "") {
        email.style.visibility = "hidden"
        return
    }
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;
    if (username === '' || password === '') {
        alert("Заполните все поля")
        return
    }
    $.ajax({
        url: '/user/login/',
        type: 'POST',
        data: {'username': username, 'password': password},
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                window.location.reload()
            } else {
                alert('Неверный логин или пароль!')
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr);
        }
    });
});

registrationBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (email.style.visibility === "hidden") {
        email.style.visibility = ""
        return
    }
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;
    if (email.value === '' || username === '' || password === '') {
        alert("Заполните все поля")
        return
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/registration/', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    }

    const data = JSON.stringify({'username': username, 'password': password, 'email': email.value});
    console.log(data)
    xhr.send(data);
    let resp = ""
   xhr.onload = function() {
       resp += JSON.parse(xhr.response).success
       if (resp.includes("false")) alert(JSON.parse(xhr.response).message)
       else {
           alert(`Пользователь ${username} зарегистрирован.`)
           window.location.href = 'http://127.0.0.1:8000/'
       }

};

});