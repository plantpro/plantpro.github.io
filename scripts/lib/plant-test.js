var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Array.prototype["remove"] = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
var Test = /** @class */ (function () {
    function Test(element, questions) {
        this.questions = questions;
        this.element = element;
        this.current = 0;
        this.score = 0;
        this.maxScore = this.questions.length;
    }
    Test.prototype.nextQuestion = function (score) {
        this.score += score;
        this.current++;
        if (this.current >= this.questions.length) {
            this.element.innerHTML = "Score: " + this.score + "/" + this.maxScore;
            return;
        }
        this.element.innerHTML = "";
        var q = this.questions[this.current];
        q.onAnswer(this.nextQuestion.bind(this));
        this.element.appendChild(q.render(this.current + 1));
    };
    Test.prototype.render = function () {
        var q = this.questions[this.current];
        q.onAnswer(this.nextQuestion.bind(this));
        this.element.appendChild(q.render(this.current + 1));
    };
    return Test;
}());
var VariantQuestion = /** @class */ (function () {
    function VariantQuestion(text, answers) {
        this.text = text;
        this.answers = answers;
    }
    VariantQuestion.prototype.onAnswer = function (handler) {
        this.onAnswerHandler = handler;
    };
    VariantQuestion.prototype.render = function (number) {
        var div = document.createElement("div");
        div.className = "question question-" + this.classSuffix;
        var heading = document.createElement("div");
        heading.className = "question-heading";
        var numberSpan = document.createElement("span");
        numberSpan.className = "question-no";
        numberSpan.innerText = number.toString();
        var questionText = document.createElement("span");
        questionText.className = "question-text";
        questionText.innerText = this.text;
        heading.appendChild(numberSpan);
        heading.appendChild(questionText);
        div.appendChild(heading);
        var answers = document.createElement("div");
        answers.className = "answers";
        var answerNumber = 1;
        for (var _i = 0, _a = this.answers; _i < _a.length; _i++) {
            var answer = _a[_i];
            var renderedAnswer = answer.render(answerNumber);
            answers.appendChild(renderedAnswer);
            renderedAnswer.addEventListener("click", this.selectAnswer.bind(this));
            answerNumber++;
        }
        div.appendChild(answers);
        var nextButton = document.createElement("button");
        nextButton.innerText = "Далее";
        nextButton.addEventListener("click", this.checkAnswer.bind(this));
        div.appendChild(nextButton);
        return div;
    };
    return VariantQuestion;
}());
var MultiQuestion = /** @class */ (function (_super) {
    __extends(MultiQuestion, _super);
    function MultiQuestion(text, answers, rightAnswerNumbers) {
        var _this = _super.call(this, text, answers) || this;
        _this.classSuffix = "multi";
        _this.rightAnswerNumbers = rightAnswerNumbers;
        _this.selected = [];
        return _this;
    }
    MultiQuestion.prototype.checkAnswer = function () {
        var score = 0;
        for (var _i = 0, _a = this.selected; _i < _a.length; _i++) {
            var ans = _a[_i];
            if (this.rightAnswerNumbers.includes(ans)) {
                score++;
            }
            else {
                score--;
            }
        }
        if (score === this.rightAnswerNumbers.length) {
            this.onAnswerHandler(1);
        }
        else {
            this.onAnswerHandler(0);
        }
    };
    MultiQuestion.prototype.selectAnswer = function (event) {
        var answer = event.target.closest(".answer");
        if (answer.classList.contains("answer-selected")) {
            answer.classList.remove("answer-selected");
            var no = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
            this.selected.remove(this.selected.indexOf(no));
        }
        else {
            answer.classList.add("answer-selected");
            var no = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
            this.selected.push(no);
        }
    };
    return MultiQuestion;
}(VariantQuestion));
var SingleQuestion = /** @class */ (function (_super) {
    __extends(SingleQuestion, _super);
    function SingleQuestion(text, answers, rightAnswerNumber) {
        var _this = _super.call(this, text, answers) || this;
        _this.classSuffix = "single";
        _this.rightAnswerNumber = rightAnswerNumber;
        _this.selected = null;
        return _this;
    }
    SingleQuestion.prototype.checkAnswer = function () {
        if (this.selected === this.rightAnswerNumber) {
            this.onAnswerHandler(1);
        }
        else {
            this.onAnswerHandler(0);
        }
    };
    SingleQuestion.prototype.selectAnswer = function (event) {
        if (this.selected != null) {
            for (var _i = 0, _a = event.target.closest(".answers").children; _i < _a.length; _i++) {
                var i = _a[_i];
                var no = parseInt(i.getElementsByClassName("answer-no")[0].innerText);
                if (no === this.selected) {
                    i.classList.remove("answer-selected");
                    this.selected = null;
                    break;
                }
            }
        }
        var answer = event.target.closest(".answer");
        if (answer.classList.contains("answer-selected")) {
            answer.classList.remove("answer-selected");
            this.selected = null;
        }
        else {
            answer.classList.add("answer-selected");
            this.selected = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
        }
    };
    return SingleQuestion;
}(VariantQuestion));
var InputQuestion = /** @class */ (function () {
    function InputQuestion(text, rightAnswer) {
        this.text = text;
        this.rightAnswer = rightAnswer;
    }
    InputQuestion.prototype.onAnswer = function (handler) {
        this.onAnswerHandler = handler;
    };
    InputQuestion.prototype.render = function (number) {
        var div = document.createElement("div");
        div.className = "question question-input";
        var heading = document.createElement("div");
        heading.className = "question-heading";
        var numberSpan = document.createElement("span");
        numberSpan.className = "question-no";
        numberSpan.innerText = number.toString();
        var questionText = document.createElement("span");
        questionText.className = "question-text";
        questionText.innerText = this.text;
        heading.appendChild(numberSpan);
        heading.appendChild(questionText);
        div.appendChild(heading);
        var answers = document.createElement("div");
        answers.className = "answers";
        var input = document.createElement("input");
        input.type = "text";
        this.input = input;
        answers.appendChild(input);
        div.appendChild(answers);
        var nextButton = document.createElement("button");
        nextButton.innerText = "Далее";
        nextButton.addEventListener("click", this.checkAnswer.bind(this));
        div.appendChild(nextButton);
        return div;
    };
    InputQuestion.prototype.checkAnswer = function () {
        if (this.input.value === this.rightAnswer) {
            this.onAnswerHandler(1);
        }
        else {
            this.onAnswerHandler(0);
        }
    };
    return InputQuestion;
}());
var HTMLAnswer = /** @class */ (function () {
    function HTMLAnswer(element) {
        if (typeof element === "string") {
            this.element = document.createElement("div");
            this.element.innerHTML = element;
        }
        else {
            this.element = element;
        }
    }
    HTMLAnswer.prototype.render = function (number) {
        var div = document.createElement("div");
        div.className = "answer html-answer";
        div.id = "answer-no-" + number;
        var numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        var content = document.createElement("div");
        content.className = "answer-content";
        content.appendChild(this.element);
        div.appendChild(content);
        return div;
    };
    return HTMLAnswer;
}());
var TextAnswer = /** @class */ (function () {
    function TextAnswer(text) {
        this.text = text;
    }
    /**
     * <div class="answer text-answer" id="answer-no-1">
     *  <span class="answer-no">1</span>
     *  <span class="answer-content"></span>
     * </div>
     */
    TextAnswer.prototype.render = function (number) {
        var div = document.createElement("div");
        div.className = "answer text-answer";
        div.id = "answer-no-" + number;
        var numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        var content = document.createElement("span");
        content.innerText = this.text;
        content.className = "answer-content";
        div.appendChild(numberSpan);
        div.appendChild(content);
        return div;
    };
    return TextAnswer;
}());
var ImageAnswer = /** @class */ (function () {
    function ImageAnswer(src, alt) {
        this.src = src;
        this.alt = alt;
    }
    /**
     * <div class="answer image-answer" id="answer-no-1">
     *  <span class="answer-no">1</span>
     *  <div class="answer-content">
     *    <img src="" alt="">
     *  </div>
     * </div>
     */
    ImageAnswer.prototype.render = function (number) {
        var div = document.createElement("div");
        div.className = "answer image-answer";
        div.id = "answer-no-" + number;
        var numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        var content = document.createElement("div");
        content.className = "answer-content";
        var image = document.createElement("img");
        image.src = this.src;
        image.alt = this.alt;
        content.appendChild(image);
        div.appendChild(numberSpan);
        div.appendChild(content);
        return div;
    };
    return ImageAnswer;
}());
