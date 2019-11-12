
const $ = document.querySelector.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login",
  CHECKLOGIN: 'http://localhost:3000/api/token-validation'
};
function getQnATemplate(list) {
  if (Array.isArray(list)) {
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
  } else return;
  
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
    if (resultHTML) target.innerHTML = resultHTML;
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
      initRender(()=>{console.log("init render end")})
    }
  };
}

const loginFunc = (id = 'codesquad', pw = 'pa$$w0rd', loginBtnObj) => {
  const user = {user: {id, pw}};
  const optObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user),
    mode: 'cors'
  };
  
  fetch(URL.LOGIN, optObj)
  .then(res => res.json())
  .then(result => {
    if (result.auth) {
      localStorage.setItem('token', result.token);
      loginBtnObj.innerText = '로그아웃';
    } else {
      alert('로그인에 실패하였습니다.');
    }
  })
  .catch(err => {
    console.log(err);
    alert('로그인 에러!');
  });
}

const addEvent = (loginBtnObj) => {
  loginBtnObj.addEventListener('click', evnt => {
    loginFunc(null, null, loginBtnObj);
  });
}

const checkLogin = (token, loginBtnObj) => {
  const optObj = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    mode: 'cors'
  };
  
  fetch(URL.CHECKLOGIN, optObj)
  .then(res => res.json())
  .then(result => {
    if (result.authResult) {
      loginBtnObj.innerText = '로그아웃';
    } else {
      alert('로그인을 다시 해 주세요.');
    }
  })
  .catch(err => {
    console.log(err);
    alert('로그인 체크 에러!');
  });
}

const initFunc = () => {
  const localStorageData = localStorage.getItem('token');
  const [loginBtn] = document.getElementsByClassName('login-btn');

  if (localStorageData) checkLogin(localStorageData, loginBtn);
  else addEvent(loginBtn);
}

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();
  initFunc();
});