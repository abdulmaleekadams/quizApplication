/*****************QUIZ CONTROLLER*************************/
var quizController = (function () {
  // Question Construtor
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  var questionLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem('questionCollection', JSON.stringify(newCollection));
    },
    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem('questionCollection'));
    },
    removeQuestionCollection: function () {
      return localStorage.removeItem('questionCollection');
    },
  };

  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  return {
    getQuestionLocalStorage: questionLocalStorage,
    addQuestionOnLocalStorage: function (newQuestnText, opts) {
      var optionsArr, corrAns, questionId, getStoredQuests, isChecked;

      optionsArr = [];
      isChecked = false;

      // Option and Correct answer handler
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].value !== '') {
          optionsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
          corrAns = opts[i].value;
          isChecked = true;
        }
      }

      // id Handler
      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }

      if (newQuestnText.value !== '') {
        if (optionsArr.length > 1) {
          if (isChecked) {
            var newQuestion = new Question(
              questionId,
              newQuestnText.value,
              optionsArr,
              corrAns
            );

            getStoredQuests = questionLocalStorage.getQuestionCollection();

            getStoredQuests.push(newQuestion);

            questionLocalStorage.setQuestionCollection(getStoredQuests);

            // Reset input area
            newQuestnText.value = '';
            for (let i = 0; i < opts.length; i++) {
              opts[i].value = '';
              opts[i].previousElementSibling.checked = false;
            }
            return true;
          } else {
            alert('Please, check the correct answer');
            return false;
          }
        } else {
          alert('You must insert at least two optionss');
          return false;
        }
      } else {
        alert('Please , insert a question');
        return false;
      }
      // console.log(questionLocalStorage.getQuestionCollection());
    },
  };
})();

/*****************UI CONTROLLER*************************/
var UIController = (function () {
  var domItems = {
    // Admin Panel Element
    questionInsertBtn: document.getElementById('question-insert-btn'),
    newQuestionText: document.getElementById('new-question-text'),
    adminOptions: document.querySelectorAll('.admin-option'),
    adminOptionsContainer: document.querySelector('.admin-options-container'),
    insertedQuestionWrapper: document.querySelector(
      '.inserted-questions-wrapper'
    ),
  };
  return {
    getDomItems: domItems,

    addInputsDynamically: function () {
      var addInput = function () {
        var inputHTML, index;

        index = document.querySelectorAll('.admin-option').length;

        inputHTML = `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${index}" name="answer" value="${index}"><input type="text" class="admin-option admin-option-${index}" value=""></div>`;
        domItems.adminOptionsContainer.insertAdjacentHTML(
          'beforeend',
          inputHTML
        );

        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          'focus',
          addInput
        );
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          'focus',
          addInput
        );
      };
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        'focus',
        addInput
      );
    },
    createQuestionList: function (getQuestions) {
      var questHTML, questNo;

      domItems.insertedQuestionWrapper.innerHTML = '';

      for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        questNo = i + 1;
        questHTML =
          '<p><span>' +
          questNo +
          '. ' +
          getQuestions.getQuestionCollection()[i].questionText +
          '</span><button id="question-' +
          getQuestions.getQuestionCollection()[i].id +
          '">Edit</p>';

        domItems.insertedQuestionWrapper.insertAdjacentHTML(
          'afterbegin',
          questHTML
        );
      }
    },
  };
})();

/*****************CONTROLLER*************************/
var controller = (function (quizCtrl, UICtrl) {
  var selectedDomItems = UICtrl.getDomItems;

  UICtrl.addInputsDynamically();

  UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

  // Add Question
  selectedDomItems.questionInsertBtn.addEventListener('click', function () {
    var adminOptions = document.querySelectorAll('.admin-option');
    var checkBool = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    if (checkBool) {
      UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
  });
})(quizController, UIController);
