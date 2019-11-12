(function() {
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
  const $loginBtn = $('.login-btn');
  const $logoutBtn = $('.logout-btn');
  const request = (url, param = {}) => {
    return fetch(url, param).then((res) => {
      if (res.status === 400) {
        throw new Error('Bad Request');
      }
      return res;
    })
  }

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
    let isCreating = false;
    //login 과정도 useState로 구현할 수 있음
    //const [loginId, setLoginId] = Plain.useState(null);
    let controller = null;

    const registerComment = async (questionId, newAnswer, signal) => {
      try {
        const res = await request(`/api/questions/${questionId}/answers`, { 
          method: 'POST', 
          headers,
          signal,
          body: JSON.stringify(newAnswer),
        });

        if (res.status === 200) {
          const targetQna = qnaList.find((qna) => {
            return qna.questionId == questionId
          });
          targetQna.answers.push(newAnswer);
          setQnAList(() => qnaList);
        }
      } finally {
        controller = null;
      }
    };

    const handleCommentSubmit = (e) => {
      if (!!controller) {
        controller.abort();
      }
      controller = new AbortController();
      const signal = controller.signal;

      const $commentBtn = e.target;
      const $commentRootNode = $commentBtn.closest('li');
      const $commnetTextarea = $commentRootNode.querySelector('textarea');

      if(!$commentRootNode) throw new Error('Cannot find target element');

      const questionId = $commentRootNode.getAttribute('_questionid');
      const newAnswer = {
        content: $commnetTextarea.value,
        name: 'dahoon',
        date: new Date().toISOString().split('T')[0],
      }
      
      registerComment(questionId, newAnswer, signal);
    };

    function renderQnA(data) {
      const target = $(".qna-wrap");
      const resultHTML = getQnATemplate(data);
      target.innerHTML = resultHTML;

      document.querySelectorAll('.comment-submit').forEach((node) => {
        node.addEventListener('click', handleCommentSubmit);
      });
    }
    async function initRender(callback) {
      try  {
        const res = await request(URL.INIT);
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
        request(URL.LOGIN, { 
          method: 'POST', 
          headers, 
          body 
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('[Login Success]');
          localStorage.setItem('token', responseData.token);
          toggleLoginBtn(LOGIN_STATUS.LOGIN);
        }).catch((e) => {
          throw new Error('[Login Failure]');
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
    
    if (!token) return;

    const tempHeader = {
      ...headers,
      'Authorization': `Bearer ${token}`,
    };

    request(URL.CHECK_TOKEN_VALIDATION, { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then((res) => res.json())
    .then((res) => {
      console.log('[Check Token Validation]', res);
      headers.Authorization = `Bearer ${token}`;
      toggleLoginBtn(LOGIN_STATUS.LOGIN);
    });
  });
})();