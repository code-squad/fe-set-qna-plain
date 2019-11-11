
const $ = document.querySelector.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login",
  LOGIN_VALIDATION: "http://localhost:3000/api/token-validation"
};
const MESSAGE = {
  LOGIN: '로그인',
  LOGOUT: '로그아웃'
};
const reqHeaders = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
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
  const [loginId, setLoginId] = Plain.useState({USER_ID: 'okys'});

  // localStorage token 확인
  const isAuth = token => localStorage.getItem('token');

  // token 유효성 검사
  const authValidation = token => {
    fetch(URL.LOGIN_VALIDATION, {
      ...reqHeaders,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(resp => resp.json())
    .then(data => console.log(JSON.stringify(data)))
    .then(() => {
      setLoginBtnMessage(MESSAGE.LOGOUT);
      renderLoginBtn();
    })
    .catch(err => console.log(err));
  }

  // 로그인 버튼의 메시지를 변경하는 방식으로 처리함.
  const setLoginBtnMessage = message => $('.login-btn').innerHTML = message;

  const login = ({ USER_ID }) => {
    fetch(URL.LOGIN, {
      ...reqHeaders,
      body: JSON.stringify({
        "user": USER_ID
      })
    })
    .then(resp => resp.json())
    .then(data => {
      console.warn('Success:', JSON.stringify(data.message))
      localStorage.setItem('token', data.token);
    })
    .catch(err => console.log(err));
  }

  // ID 초기화 및 토큰 삭제
  const logout = () => {
    localStorage.removeItem('token');
    // Plain.js 가 완전하지 않기 때문에 완전히 지워지지는 않음.
    setLoginId(() => null);
    console.warn('logout.')
  }

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
    } catch (err) {
      console.error("render fetching error");
    }
  }

  return {
    render() {
      if(qnaList.length > 0) renderQnA(qnaList)
    },
    initComponent() {
      initRender(()=>{console.log("init render end")});
      setLoginId(()=>({ USER_ID: 'okys' }));
      $(".login-btn").addEventListener("click", this.handleLoginClick);
    },
    handleLoginClick() {
      if (!isAuth()) {
        login(loginId);
        setLoginBtnMessage(MESSAGE.LOGOUT);
      } else {
        logout();
        setLoginBtnMessage(MESSAGE.LOGIN);
      }
    },
    initAuth() {
      const authToken = isAuth();
      authToken && authValidation(authToken);
    }
  };
}

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initAuth();
  qnaService.initComponent();
});
