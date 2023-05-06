let modal_quiz_creat = document.getElementById('modal_quiz_creat');
const save = document.getElementById('save');
let spanq = document.getElementsByClassName("close")[1];
const addAnswer = document.getElementById("addAnswer");
const quiz_creat = document.getElementById("quiz_creat");
const br = document.getElementById("br2");

let brId = 3

spanq.onclick = function () {
    modal_quiz_creat.style.display = "none";
}

window.onload = () => {
    gen_q.onclick = () => {
        $.ajax({
        url: '/gen_q/',
        type: 'POST',
        dataType: 'json',
        success: function (response) {
            if (response) {
               console.log(response.message)
               document.getElementById("question").value = response.message
               document.getElementById("question").disabled = 'disabled'
            }
        },
    })
    }
}
quiz_creat.addEventListener('click', () => {
        modal_quiz_creat.style.display = 'block';
    });


save.addEventListener('click', async (e) => {
    e.preventDefault();
    const question = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    let answers = [answer1, answer2]
    if (!document.querySelector('input[name="radio"]:checked')) {
        alert("Выберите один правильный ответ")
        return
    }
    let radio = document.querySelector('input[name="radio"]:checked').value
    for (let i = 3; i < brId; i++) answers.push(document.getElementById('answer'+i).value)
    $.ajax({
        url: '/create-new-quiz/',
        type: 'POST',
        data: {question: question, answers: answers, radio: radio},
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                window.location.reload()
            } else {
                alert(response.message)
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr);
        }
    });
});

addAnswer.addEventListener('click', async (e) => {
    console.log("add answer")
    if (brId === 3) {
        br.insertAdjacentHTML("afterend", `<div style="display: flex"><input class="form-control" id="answer${brId}" placeholder="Ответ #${brId}"><input name="radio" value="${brId}" id="r${brId}" type="radio"></div><br id="br${brId}">`)
        brId += 1;
    }
    else {
        document.getElementById("br"+(brId-1)).insertAdjacentHTML("afterend", `<div style="display: flex"><input class="form-control" id="answer${brId}" placeholder="Ответ #${brId}"><input name="radio" value="${brId}" id="r${brId}" type="radio"></div><br id="br${brId}">`)
        brId += 1;
    }

});