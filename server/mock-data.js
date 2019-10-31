const _getDate = (y,m,d) => {
    return new Date(y, m-1, d+1).toISOString().split('T')[0];
}

module.exports = {
  list: [
    {
      questionId: 2,
      title: "자바는 왜 객체지향 언어로 태어났을까요?",
      question:
        "자바초보 입니다. 자바를 배우려고 하면 객체지향 프로그래밍 언어부터 알아야 한다고 합니다. 이부분이 잘 어렵네요. ",
      answers: [
        { content: "우리동네 우리라는 하얀색 강아지가 짖곤 했지..", questionId: 2, name: "crongro", date:_getDate(2019,10,02)},
        { content: "이 대답은 제대로 된 대답이 확실해", questionId: 2, name: "crongro", date:_getDate(2019,09,01)},
      ]
    },
    {
      questionId: 3,
      title: "자바스크립트 언어는 함수형? 객체지향?",
      question:
        "스크립트 언어라고 알고 있는데요. OOP, FP방식 중 어떤 것이 더 어울리고, 실제 구현 가능할까요?  ",
      answers: [
        {
          content:
            "둘 다 아닌 듯... 그냥 마음대로 함수중심 프로그래밍이 어울려요 ㅎㅎ",
          questionId: 3,
          name: "crongro",
          date: _getDate(2019, 03, 10)
        },
        {
          content: "두개를 절묘하게 섞는 것도 중요할 거 같아요.",
          questionId: 3,
          name: "crongro",
          date:_getDate(2019, 09, 13)
        }
      ]
    }
  ]
};
