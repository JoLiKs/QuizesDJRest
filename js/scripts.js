const xhl_answers = new XMLHttpRequest()
xhl_answers.open('GET', 'http://localhost:8000/api/joined/')
xhl_answers.responseType = 'json';
xhl_answers.send()
const quiz = document.getElementById('quiz')
const quizQuestions = document.getElementById('quiz-questions')
const quizIndicator = document.getElementById('quiz-indicator')
const quizResult = document.getElementById('quiz-results')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')
const formSendResult = document.getElementById('form-results')
const btnSendResults = document.getElementById('btnSendResults')
const usertg = document.getElementById('usertg')
let localResults = {}

const renderIndicator = (quizStep) => {
    quizIndicator.innerHTML = `${quizStep}/${data.length}`
}
let data = []
xhl_answers.onload = () => {
                let answers = []
                xhl_answers.response.forEach((ans) => {
                    if (ans.question == child.innerHTML) {
                        answers = [...answers, {
                    id: ans.id,
                    value: ans.val,
                    isCorrect: ans.isCorrect
                }]}})
                data.push({
                    question: question.innerHTML,
                    answers: answers
                })
}
btnSendResults.addEventListener('click', (event) => {
    que = data[0].question
    let true_ans = ''
    let ans = 'Ответы были следующие:\n'
    data[0].answers.forEach((a) => {
        if (a.isCorrect) true_ans = a.value
        ans+=a.value+'\n'
    })
    result_message = `Вопрос: ${que}\n${ans}Верным ответом было: ${true_ans}`
        console.log("sending")
        fetch('http://localhost:8000/api/tg/', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: usertg.value, msg: result_message})
    }).then(res=>res.json())
      .then(res => console.log(res));
        alert('Результаты отправлены')
    })
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
        <div class="quiz-question-item-qestion">${data[index].question}</div>
        <ul class="quiz-question-item-answer">${renderAnswers()}</ul>
    </div>
    `
}

setTimeout(() => {
    document.body.style.visibility = 'visible'
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

        const getAnswers = (index) =>
            data[index]
                .answers
                .map((answer) => `<li class="${checkIsCorrect(answer, index)}">${answer.value}</li>`)
                .join('')

        data.forEach((question, index) => {
            result += `
        <div class="quiz-result-item">
            <div class="quiz-result-item-qestion">${question.question}</div>
            <ul class="quiz-result-item-answer">${getAnswers(index)}</ul>
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
                quizResult.style.visibility = 'visible'
                btnRestart.style.visibility = 'visible'
                formSendResult.style.visibility = 'visible'
                renderResults()
            } else {
                renderQuestion(nextQuestionIndex)
            }
        } else if (event.target.classList.contains('btn-restart')) {
            localResults = {}
            quizResult.innerHTML = ''

            quizQuestions.classList.remove('questions--hidden')
            quizIndicator.classList.remove('quiz--hidden')
            btnNext.style.visibility = 'visible'
            quizResult.style.visibility = 'hidden'
            btnRestart.style.visibility = 'hidden'
            formSendResult.style.visibility = 'hidden'
            renderQuestion(0)
        }
    })

    renderQuestion(0)
}, 70)