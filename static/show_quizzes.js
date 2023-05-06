const allQuizzes = document.getElementById('quizzes')
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
const renderMainPage = () => {
    let url = '/api/quizzes/';
    let csrftoken = getCookie('csrftoken')
    $.ajax({
        url: url,
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        success: function (response) {
            if (response) {
                let resultMain = ``
                resultMain += `
                    <div class="card" id="card">
                        <div class="face face1" id="face-1">
                     ${response.ans}
                     ${response.ans}
                        </div>
                    </div>
                `;
                allQuizzes.innerHTML = resultMain;
            }
        },
        error: function (xhr, status, error) {
            console.error(xhr);
        }
    });
}

renderMainPage()
