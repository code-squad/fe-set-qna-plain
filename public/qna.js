
const $ = document.querySelector.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login",
  CHECK_TOKEN_VALIDATION: "http://localhost:3000/api/token-validation",
};
const LOGIN_STATUS = {
  LOGIN: 0,
  LOGOUT: 1,
};
const headers = {
  'Content-Type': 'application/json',
};
const $loginBtn = document.querySelector('.login-btn');
const $logoutBtn = document.querySelector('.logout-btn');

function toggleLoginBtn(status) {
  switch (status) {
    case LOGIN_STATUS.LOGIN:
      $loginBtn.style.display = 'none';
      $logoutBtn.style.display = 'block';
      break;
    case LOGIN_STATUS.LOGOUT:
        $loginBtn.style.display = 'block';
        $logoutBtn.style.display = 'none';
      break;
  }
}

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
    try  {
      const res = await fetch(URL.INIT);
      const result = await res.json();
      setQnAList(data => result.list || data);
      callback();
    } catch (err) {
      console.error("render fetching error");
    }
  }
  function registerEvent() {
    $loginBtn.addEventListener('click', () => {
      const body = JSON.stringify({ user: 'dahoon' });
      fetch(URL.LOGIN, { 
        method: 'POST', 
        headers, 
        body 
      })
      .then((res) => res.json())
      .then((res) => {
        console.log('[Login Success]');
        localStorage.setItem('token', res.token);
        toggleLoginBtn(LOGIN_STATUS.LOGIN);
      });
    });
  }

  return {
    render() {
      if(qnaList.length > 0) renderQnA(qnaList)
    },
    initComponent() {
      initRender(()=>{
        console.log("init render end");
        registerEvent();
      });
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();

  const token = localStorage.getItem('token');
  console.log('token : ', token);
  if (!token) {
    return;
  }

  const tempHeader = {
    ...headers,
    'Authorization': `Bearer ${token}`,
  };

  fetch(URL.CHECK_TOKEN_VALIDATION, { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  .then((res) => res.json())
  .then((res) => {
    console.log('[Check Token Validation]', res);
    headers.Authorization = token;
    toggleLoginBtn(LOGIN_STATUS.LOGIN);
  });
});