const $ = document.querySelector.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login",
  VALIDATION: "http://localhost:3000/api/token-validation"
};

function getQnATemplate(list) {
  return list.reduce((html, {
    title,
    question,
    questionId,
    answers
  }) => {
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
  return answers.reduce((html, {
    content,
    name,
    date
  }) => {
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
      initRender(() => {
        console.log("init render end")
      })
    }
  };
}

let validation = false;

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();

  const token = localStorage.getItem('token');
  if (token) isTokenValid(token);

  $('.login-btn').addEventListener("click", () => {
    $('.login-btn').innerText === '로그인' ? getLogin() : getLogout()
  })
});

const getLogin = () => {
  const body = {
    user: 'soom'
  };

  const fetchData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }

  fetch(URL.LOGIN, fetchData)
    .then(response => response.json())
    .then(data => data.auth ? setLoginInfo(data.message, data.token, body.user) : console.log('login: error'))
    .catch(e => console.log(e));
}

const setLoginInfo = (message, token, userName) => {
  console.log(message, '로그인 되셨습니당...');
  localStorage.setItem('token', token);
  setUserName(userName);
}

const getLogout = () => {
  localStorage.clear();
  $('.login-btn').innerText = "로그인";
  console.log('로그아웃 되셨습니당...')
}

const isTokenValid = token => {
  const fetchData = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  fetch(URL.VALIDATION, fetchData)
    .then(response => response.json())
    .then(data => {
      if (data.authResult) {
        setUserName(data.id);
        validation = !validation;
      } else {
        console.log('토큰이 유효하지 않습니다.');
        getLogout();
      }
    })
    .catch(e => console.log(e));
}

const setUserName = (userName) => {
  localStorage.setItem('username', userName);
  $('.login-btn').innerText = userName;
}