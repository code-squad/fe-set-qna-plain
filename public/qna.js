
const $ = document.querySelector.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login"
};
function getQnATemplate(list) {
  return list.reduce((html, { title, question, questionId, answers }) => {
    return (
      html +
      ` <li class="qna" _questionId=${+questionId}>
        <div class="qna-title">
            <h2>${title}</h2>
        </div>
        <div class="question">
            <p> ${question}</p>
        </div>
        <ul class="answer">${getAnswerTemplate(answers)}</ul>
        <div class="answer-form">
            <form method="POST">
                <textarea name="answer-content" class="answer-content-textarea" cols="30" rows="2" placeholder="새로운답변.."></textarea>
            </form>
            <button class="comment-submit">등록</button>
        </div>
    </li>`
    );
  }, ``);
}


function getAnswerTemplate(answers) {
  return answers.reduce((html, { content, name, date }) => {
    return (
      html +
      `
        <li class="answer-list" ">
            <p class="answer-content">${content}</p>
            <div class="answer-profile">
                <span class="answer-writer">${name} | </span>
                <span class="answer-date">${date}</span>
            </div>
        </li>`
    );
  }, ``);
}

//Component
function QNA() {

  const [qnaList, setQnAList] = Plain.useState([]);
  //login 과정도 useState로 구현할 수 있음
  //const [loginId, setLoginId] = Plain.useState(null);

  function renderQnA(data) {
    const target = $(".qna-wrap");
    const resultHTML = getQnATemplate(data);
    target.innerHTML = resultHTML;
  }
  async function initRender(callback) {
    try {
      const res = await fetch(URL.INIT);
      const result = await res.json();
      setQnAList(data => result.list || data);
    } catch (err) {
      console.error("render fetching error");
    }
  }

  return {
    render() {
      if (qnaList.length > 0) renderQnA(qnaList)
    },
    initComponent() {
      initRender(() => { console.log("init render end") })
    }
  };
}

function Account() {
  const login = () => {
    fetch(URL.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: 'jjori-master' }),
    }).then(res => {
      if (res && res.status === 200) {
        return res.json();
      }
      throw new Error(res.status);
    }).then(data => {
      if (data && data.token) {
        localStorage.set('token', data.token);
        return;
      }

      throw new Error(res.status);
    }).catch(err => {
      console.error(err);
      alert(err && err.message || 'Login에 실패 하였습니다.\n관리자에게 문의하시기 바랍니다.')
    });
  };

  return {
    init() {
      $(".login-btn").addEventListener('click', () => {
        login();
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();

  const accountService = Account();
  accountService.init();
});