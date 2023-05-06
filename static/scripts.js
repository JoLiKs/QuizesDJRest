const xhl_answers = new XMLHttpRequest()
xhl_answers.open('GET', 'http://localhost:8000/api/joined/')
xhl_answers.responseType = 'json'
xhl_answers.send()
const quiz = document.getElementById('quiz')
const quizQuestions = document.getElementById('quiz-questions')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const bod = document.getElementById('bod')
const btnSendResults = document.getElementById('btnSendResults')
const form_results = document.getElementById('form_results')
const start = document.getElementById('start')
const quizControls = document.getElementById('btn-restart')
let localResults = {}

const renderIndicator = (quizStep) => {
    quizIndicator.innerHTML = `${quizStep}/${data.length}`
    quizIndicator.style.width = `${(quizStep / data.length)*100}%`
}
let data = []
xhl_answers.onload = () => {
        let newdat = []
        let quizes_url = 'http://localhost:8000/api/v1/quizes/'
        let xhl_quizes = new XMLHttpRequest()
        xhl_quizes.responseType = 'json';
        xhl_quizes.open('GET', quizes_url)
        xhl_quizes.send()
        xhl_quizes.onload = () => {
            console.log(xhl_answers.response)
            console.log(xhl_quizes.response)

            xhl_quizes.response.forEach(quiz => {
                let answers = []
                xhl_answers.response.forEach((ans) => {
                    if (ans.question === quiz.id) {
                        answers = [...answers, {
                    id: ans.id,
                    value: ans.val,
                    isCorrect: ans.isCorrect
                }]}})
                data.push({
                    question: quiz.question,
                    answers: answers
                })
            })
        }
}
const renderQuestion = (index) => {
    renderIndicator(index + 1)
    quizQuestions.dataset.currentStep = index
    btnNext.disabled = true

    const renderAnswers = () =>
        data[index]
            .answers
            .map((answer) =>
                `
            <li>
                <label>
                    <input class="answer-input" type="radio" name="${index}" value="${answer.id}">
                    ${answer.value}
                </label>
            </li>
            `
            )
            .join('')

    quizQuestions.innerHTML = `
    <div class="quiz-question-item">
        <span class="quiz-question" style="margin-bottom: 10px">${data[index].question}</span>
        <ul class="quiz-question-item-answer">${renderAnswers()}</ul>
    </div>
    `
}
start.addEventListener('click', (event) => {
    if (bod.style.visibility === 'visible') {
        bod.style.visibility = 'hidden'
        start.innerHTML = "Начать"
        quizResult.style.visibility = 'hidden'
        form_results.style.visibility = 'hidden'
        quizControls.style.visibility = 'hidden'
        return
    }
    bod.style.visibility = 'visible'
    quizResult.style.visibility = 'visible'
    if (btnNext.style.visibility === 'hidden') form_results.style.visibility = 'visible'
    quizControls.style.visibility = 'visible'
    start.innerHTML = "Закрыть квизы"
})
let tg_res = ''
btnSendResults.addEventListener('click', (event) => {
    que = data[0].question
    result_message = "Результаты\n\n"+tg_res
        console.log("sending")
        fetch('http://localhost:8000/api/tg/', {
      method: 'post',
      headers: {
          'X-CSRFToken': getCookie('csrftoken'),
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: usertg.value, msg: result_message})
    }).then(res=>res.json())
      .then(res => console.log(res));
        alert('Результаты отправлены')
    })

setTimeout(() => {

    const renderResults = () => {
        let result = 'Результаты теста:'

        const checkIsCorrect = (answer, index) => {
            let className = ''

            if (!answer.isCorrect) {
                className = 'answer-invalid'
            } else if (answer.isCorrect) {
                className = 'answer-valid'
            }

            return className
        }
        const getAnswers = (index, tg) => {
            if (tg) return data[index]
                .answers
                .map((answer) => {
                    if (checkIsCorrect(answer, index) === "answer-valid") {
                        return `верный: ${answer.value}`
                    }
                    return `${answer.value}`
                })
           else return data[index]
                .answers
                .map((answer) => `<li class="${checkIsCorrect(answer, index)}">${answer.value}</li>`)
                .join('')
        }

        data.forEach((question, index) => {
            tg_res +=`Вопрос: ${question.question}\nОтветы: ${getAnswers(index, true)}`
            result += `
        <div class="quiz-result-item">
            <div class="quiz-result-item-qestion">${question.question}</div>
            <ul class="quiz-result-item-answer">${getAnswers(index, false)}</ul>
        </div>
        `
        })

        quizResult.innerHTML = result
    }

    quiz.addEventListener('change', (event) => {
        if (event.target.classList.contains('answer-input')) {
            localResults[event.target.name] = event.target.value
            btnNext.disabled = false
        }
    })

    quiz.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-next')) {
            const nextQuestionIndex = Number(quizQuestions.dataset.currentStep) + 1
            if (nextQuestionIndex === data.length) {

                quizQuestions.classList.add('questions--hidden')
                quizIndicator.classList.add('quiz--hidden')
                btnNext.style.visibility = 'hidden'
                form_results.style.visibility = 'visible'
                quizResult.style.visibility = 'visible'
                btnRestart.style.visibility = 'visible'

                renderResults()
            } else {
                renderQuestion(nextQuestionIndex)
            }
        } else if (event.target.classList.contains('btn-restart')) {
            localResults = {}
            quizResult.innerHTML = ''
            form_results.style.visibility = 'hidden'
            quizQuestions.classList.remove('questions--hidden')
            quizIndicator.classList.remove('quiz--hidden')
            btnNext.style.visibility = 'visible'
            quizResult.style.visibility = 'hidden'
            btnRestart.style.visibility = 'hidden'

            renderQuestion(0)
        }
    })

    renderQuestion(0)
}, 400)