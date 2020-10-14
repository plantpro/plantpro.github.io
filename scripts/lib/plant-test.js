Array.prototype["remove"] = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
class Test extends HTMLElement {
    constructor(questions) {
        super();
        this.questions = questions;
        this.current = 0;
        this.score = 0;
        this.maxScore = this.questions.length;
    }
    nextQuestion(score) {
        this.score += score;
        this.current++;
        if (this.current >= this.questions.length) {
            this.innerHTML = "Score: " + this.score + "/" + this.maxScore;
            return;
        }
        this.innerHTML = "";
        let q = this.questions[this.current];
        q.onAnswer(this.nextQuestion.bind(this));
        this.appendChild(q.render(this.current + 1));
    }
    render() {
        let q = this.questions[this.current];
        q.onAnswer(this.nextQuestion.bind(this));
        this.appendChild(q.render(this.current + 1));
    }
}
customElements.define("plant-test", Test);
class VariantQuestion {
    constructor(text, answers) {
        this.text = text;
        this.answers = answers;
    }
    onAnswer(handler) {
        this.onAnswerHandler = handler;
    }
    render(number) {
        let div = document.createElement("div");
        div.className = "question question-" + this.classSuffix;
        let heading = document.createElement("div");
        heading.className = "question-heading";
        let numberSpan = document.createElement("span");
        numberSpan.className = "question-no";
        numberSpan.innerText = number.toString();
        let questionText = document.createElement("span");
        questionText.className = "question-text";
        questionText.innerText = this.text;
        heading.appendChild(numberSpan);
        heading.appendChild(questionText);
        div.appendChild(heading);
        let answers = document.createElement("div");
        answers.className = "answers";
        let answerNumber = 1;
        for (const answer of this.answers) {
            let renderedAnswer = answer.render(answerNumber);
            answers.appendChild(renderedAnswer);
            renderedAnswer.addEventListener("click", this.selectAnswer.bind(this));
            answerNumber++;
        }
        div.appendChild(answers);
        let nextButton = document.createElement("button");
        nextButton.innerText = "Проверить";
        nextButton.id = "next-button";
        nextButton.addEventListener("click", this.checkAnswer.bind(this));
        div.appendChild(nextButton);
        return div;
    }
}
class MultiQuestion extends VariantQuestion {
    constructor(text, answers, rightAnswerNumbers) {
        super(text, answers);
        this.classSuffix = "multi";
        this.rightAnswerNumbers = rightAnswerNumbers;
        this.selected = [];
    }
    checkAnswer() {
        let score = 0;
        for (const ans of this.selected) {
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
    }
    selectAnswer(event) {
        let answer = event.target.closest(".answer");
        if (answer.classList.contains("answer-selected")) {
            answer.classList.remove("answer-selected");
            let no = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
            this.selected.remove(this.selected.indexOf(no));
        }
        else {
            answer.classList.add("answer-selected");
            let no = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
            this.selected.push(no);
        }
    }
}
class SingleQuestion extends VariantQuestion {
    constructor(text, answers, rightAnswerNumber) {
        super(text, answers);
        this.classSuffix = "single";
        this.flag = false;
        this.rightAnswerNumber = rightAnswerNumber;
        this.selected = null;
    }
    getAnswerByNumber(number) {
        let answers = document.querySelectorAll(".answer");
        for (const answer of answers) {
            let no = parseInt(answer.querySelector(".answer-no").innerText);
            if (no === number) {
                return answer;
            }
        }
    }
    hightlightAnswers() {
        if (this.selected === this.rightAnswerNumber) {
            this.getAnswerByNumber(this.selected).classList.add("correct-answer");
        }
        else {
            this.getAnswerByNumber(this.rightAnswerNumber).classList.add("correct-answer");
            this.getAnswerByNumber(this.selected).classList.add("wrong-answer");
        }
    }
    checkAnswer() {
        if (!this.flag) {
            this.hightlightAnswers();
            document.querySelector("#next-button").innerText = "Далее";
            this.flag = true;
        }
        else {
            if (this.selected === this.rightAnswerNumber) {
                this.onAnswerHandler(1);
            }
            else {
                this.onAnswerHandler(0);
            }
        }
    }
    selectAnswer(event) {
        if (this.selected != null) {
            for (let i of event.target.closest(".answers").children) {
                let no = parseInt(i.getElementsByClassName("answer-no")[0].innerText);
                if (no === this.selected) {
                    i.classList.remove("answer-selected");
                    this.selected = null;
                    break;
                }
            }
        }
        let answer = event.target.closest(".answer");
        if (answer.classList.contains("answer-selected")) {
            answer.classList.remove("answer-selected");
            this.selected = null;
        }
        else {
            answer.classList.add("answer-selected");
            this.selected = parseInt(answer.getElementsByClassName("answer-no")[0].innerText);
        }
    }
}
class InputQuestion {
    constructor(text, rightAnswer) {
        this.text = text;
        this.rightAnswer = rightAnswer;
    }
    onAnswer(handler) {
        this.onAnswerHandler = handler;
    }
    render(number) {
        let div = document.createElement("div");
        div.className = "question question-input";
        let heading = document.createElement("div");
        heading.className = "question-heading";
        let numberSpan = document.createElement("span");
        numberSpan.className = "question-no";
        numberSpan.innerText = number.toString();
        let questionText = document.createElement("span");
        questionText.className = "question-text";
        questionText.innerText = this.text;
        heading.appendChild(numberSpan);
        heading.appendChild(questionText);
        div.appendChild(heading);
        let answers = document.createElement("div");
        answers.className = "answers";
        let input = document.createElement("input");
        input.type = "text";
        this.input = input;
        answers.appendChild(input);
        div.appendChild(answers);
        let nextButton = document.createElement("button");
        nextButton.innerText = "Далее";
        nextButton.addEventListener("click", this.checkAnswer.bind(this));
        div.appendChild(nextButton);
        return div;
    }
    checkAnswer() {
        if (this.input.value === this.rightAnswer) {
            this.onAnswerHandler(1);
        }
        else {
            this.onAnswerHandler(0);
        }
    }
}
class HTMLAnswer {
    constructor(element) {
        if (typeof element === "string") {
            this.element = document.createElement("div");
            this.element.innerHTML = element;
        }
        else {
            this.element = element;
        }
    }
    render(number) {
        let div = document.createElement("div");
        div.className = "answer html-answer";
        div.id = "answer-no-" + number;
        let numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        let content = document.createElement("div");
        content.className = "answer-content";
        content.appendChild(this.element);
        div.appendChild(content);
        return div;
    }
}
class TextAnswer {
    constructor(text) {
        this.text = text;
    }
    /**
     * <div class="answer text-answer" id="answer-no-1">
     *  <span class="answer-no">1</span>
     *  <span class="answer-content"></span>
     * </div>
     */
    render(number) {
        let div = document.createElement("div");
        div.className = "answer text-answer";
        div.id = "answer-no-" + number;
        let numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        let content = document.createElement("span");
        content.innerText = this.text;
        content.className = "answer-content";
        div.appendChild(numberSpan);
        div.appendChild(content);
        return div;
    }
}
class ImageAnswer {
    constructor(src, alt) {
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
    render(number) {
        let div = document.createElement("div");
        div.className = "answer image-answer";
        div.id = "answer-no-" + number;
        let numberSpan = document.createElement("span");
        numberSpan.innerText = number.toString();
        numberSpan.className = "answer-no";
        let content = document.createElement("div");
        content.className = "answer-content";
        let image = document.createElement("img");
        image.src = this.src;
        image.alt = this.alt;
        content.appendChild(image);
        div.appendChild(numberSpan);
        div.appendChild(content);
        return div;
    }
}
