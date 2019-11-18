const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const URL = {
  INIT: "http://localhost:3000/api/questions",
  LOGIN: "http://localhost:3000/api/login",
  VALIDATE_TOKEN: "http://localhost:3000/api/token-validation",
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
      const res = await fetch(URL.INIT); fetch(URL.INIT);
      const result = await res.json();
      setQnAList(data => result.list || data);

      if (typeof callback === 'function') {
        callback();
      }

    } catch (err) {
      console.error("render fetching error");
    }
  }

  async function writeAnswer(questionId, answer) {
    if (!answer || answer.length < 1) {
      alert('답변 내용을 기입하세요~!!');
      return;
    }

    const url = `/api/questions/${questionId}/answers`;
    const properties = {
      answer: answer,
    }

    try {
      const res = await REST.post(url, properties);
      const data = await res.json();

      renderQnA(data.list);
    } catch (err) {
      console.error(err);
      alert((err && err.message) || '댓글 등록에 실패하였습니다.\n관리자에게 문의하시기 바랍니다.');
    }
  }

  function initQnaEventListener() {
    [...$$('ul.qna-wrap .qna')].forEach(target => {
      target.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (evt.target.className !== 'comment-submit') {
          return;
        }

        const questionId = target.getAttribute('_questionid');
        const answer = target.getElementsByTagName('form')[0].getElementsByTagName('textarea')[0].value;

        writeAnswer(questionId, answer);
      });
    });
  }


  return {
    render() {
      if (qnaList.length > 0) renderQnA(qnaList)
    },
    initComponent() {
      initRender(() => {
        console.log("init render end")
        initQnaEventListener();
      })
    }
  };
}

function Account() {
  const login = () => {
    REST.post(URL.LOGIN, { user: 'jjori-master' })
      .then(res => {
        if (res && res.status === 200) {
          return res.json();
        }
        throw new Error(res.status);
      }).then(data => {
        if (data && data.token) {
          REST.setToken(data.token);
          return;
        }

        throw new Error(res.status);
      }).catch(err => {
        console.error(err);
        alert(err && err.message || 'Login에 실패 하였습니다.\n관리자에게 문의하시기 바랍니다.')
      });
  };

  const checkValidationToken = (token) => {
    REST.post(URL.VALIDATE_TOKEN)
      .then(res => {
        if (res && res.status === 200) {
          // TODO - login 성공으로 바꿔준다.
          return;
        }
      });
  }

  return {
    init() {
      $(".login-btn").addEventListener('click', () => {
        login();
      });

      // 유효성 검사
      checkValidationToken();
    },
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let qnaService = Plain.renderComponent(QNA);
  qnaService.initComponent();

  const accountService = Account();
  accountService.init();
});