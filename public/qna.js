
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
  const [loginId, setLoginId] = Plain.useState(null);

  function renderQnA(data) {
    const target = $(".qna-wrap");
    const resultHTML = getQnATemplate(data);
    target.innerHTML = resultHTML;
  }
  function login() {
    const id = 'admin ';
    fetch(URL.LOGIN, {
      method: 'post',
      body: JSON.stringify({ user: id }),
      headers: { 'Content-type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        console.log('login!');
        const storage = window.localStorage;
        storage.setItem('token', res.token);
        // 실행시 에러가 발생해서 일단 주석 처리
        // setLoginId(() => id);
        $('.login-btn').innerText = `로그아웃${id}`;
      })
  }
  async function initRender(callback) {
    try  {
      const res = await fetch(URL.INIT);
      const result = await res.json();
      setQnAList(data => result.list || data);

      $('.login-btn').addEventListener('click', login);
    } catch (err) {
      console.error("render fetching error");
    }
  }

  return {
    render() {
      if(qnaList.length > 0) renderQnA(qnaList)
    },
    initComponent() {
      initRender(()=>{console.log("init render end")})
    }
  };
}

const checkTokenValid = () => {
  const token = window.localStorage.getItem('token');
  if(!token) return;
  fetch('/api/token-validation',{
    method: 'post',
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(res => res.json())
    .then(res => {
      if(res.authResult) $('.login-btn').innerText = `로그아웃(${res.id})`;
    })
};

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();
  checkTokenValid();
});