Array.prototype["remove"] = function (from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

class Test {
  private questions: Question[];
  private element: Element;
  private current: number;
  private score: number;
  public maxScore: number;

  constructor(element: Element, questions: Question[]) {
    this.questions = questions;
    this.element = element;
    this.current = 0;
    this.score = 0;
    this.maxScore = this.questions.length;
  }

  nextQuestion(score: number) {
    this.score += score;

    this.current++;

    if (this.current >= this.questions.length) {
      this.element.innerHTML = "Score: " + this.score + "/" + this.maxScore;
      return;
    }

    this.element.innerHTML = "";
    let q = this.questions[this.current];
    q.onAnswer(this.nextQuestion.bind(this));
    this.element.appendChild(q.render(this.current + 1));
  }

  render() {
    let q = this.questions[this.current];
    q.onAnswer(this.nextQuestion.bind(this));
    this.element.appendChild(q.render(this.current + 1));
  }
}

interface Question {
  render(number: number): Element;
  onAnswer(handler: (score: number) => void): void;
}

abstract class VariantQuestion implements Question {
  protected abstract classSuffix: string;

  protected text: string;
  protected answers: Answer[];

  protected onAnswerHandler: (isCorrect: number) => void;

  constructor(text: string, answers: Answer[]) {
    this.text = text;
    this.answers = answers;
  }

  onAnswer(handler: (isCorrect: number) => void) {
    this.onAnswerHandler = handler;
  }

  render(number: number): Element {
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
    nextButton.innerText = "Далее";
    nextButton.addEventListener("click", this.checkAnswer.bind(this));

    div.appendChild(nextButton);

    return div;
  }

  abstract checkAnswer(): void;
  abstract selectAnswer(event: { target: Element }): void;
}

class MultiQuestion extends VariantQuestion {
  private rightAnswerNumbers: number[];
  private selected: number[];

  protected classSuffix: string = "multi";

  constructor(text: string, answers: Answer[], rightAnswerNumbers: number[]) {
    super(text, answers);
    this.rightAnswerNumbers = rightAnswerNumbers;
    this.selected = [];
  }

  checkAnswer(): void {
    let score = 0;
    for (const ans of this.selected) {
      if (this.rightAnswerNumbers.includes(ans)) {
        score++;
      } else {
        score--;
      }
    }

    if (score === this.rightAnswerNumbers.length) {
      this.onAnswerHandler(1);
    } else {
      this.onAnswerHandler(0);
    }
  }

  selectAnswer(event: { target: Element }) {
    let answer = event.target.closest(".answer") as Element;
    if (answer.classList.contains("answer-selected")) {
      answer.classList.remove("answer-selected");
      let no = parseInt((answer.getElementsByClassName("answer-no")[0] as HTMLSpanElement).innerText);
      (this.selected as any).remove(this.selected.indexOf(no));
    } else {
      answer.classList.add("answer-selected");
      let no = parseInt((answer.getElementsByClassName("answer-no")[0] as HTMLSpanElement).innerText);
      this.selected.push(no);
    }
  }
}

class SingleQuestion extends VariantQuestion {
  private rightAnswerNumber: number;
  private selected: number | null;

  protected classSuffix: string = "single";

  constructor(text: string, answers: Answer[], rightAnswerNumber: number) {
    super(text, answers);
    this.rightAnswerNumber = rightAnswerNumber;
    this.selected = null;
  }

  checkAnswer() {
    if (this.selected === this.rightAnswerNumber) {
      this.onAnswerHandler(1);
    } else {
      this.onAnswerHandler(0);
    }
  }

  selectAnswer(event: { target: Element }) {
    if (this.selected != null) {
      for (let i of event.target.closest(".answers").children) {
        let no = parseInt((i.getElementsByClassName("answer-no")[0] as HTMLSpanElement).innerText);
        if (no === this.selected) {
          i.classList.remove("answer-selected");
          this.selected = null;
          break;
        }
      }
    }

    let answer = event.target.closest(".answer") as Element;
    if (answer.classList.contains("answer-selected")) {
      answer.classList.remove("answer-selected");
      this.selected = null;
    } else {
      answer.classList.add("answer-selected");
      this.selected = parseInt((answer.getElementsByClassName("answer-no")[0] as HTMLSpanElement).innerText);
    }
  }
}

class InputQuestion implements Question {
  protected text: string;
  protected rightAnswer: string;

  protected onAnswerHandler: (score: number) => void;

  private input: HTMLInputElement;

  constructor(text: string, rightAnswer: string) {
    this.text = text;
    this.rightAnswer = rightAnswer;
  }

  onAnswer(handler: (score: number) => void) {
    this.onAnswerHandler = handler;
  }

  render(number: number): Element {
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

  checkAnswer(): void {
    if (this.input.value === this.rightAnswer) {
      this.onAnswerHandler(1);
    } else {
      this.onAnswerHandler(0);
    }
  }
}

interface Answer {
  render(number: number): Element;
}

class HTMLAnswer implements Answer {
  private element: Element;

  constructor(element: Element | string) {
    if (typeof element === "string") {
      this.element = document.createElement("div");
      this.element.innerHTML = element;
    } else {
      this.element = element;
    }
  }

  render(number: number): Element {
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

class TextAnswer implements Answer {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  /** 
   * <div class="answer text-answer" id="answer-no-1">
   *  <span class="answer-no">1</span>
   *  <span class="answer-content"></span>
   * </div> 
   */
  render(number: number): Element {
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

class ImageAnswer implements Answer {
  private src: string;
  private alt: string;

  constructor(src: string, alt: string) {
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
  render(number: number): Element {
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