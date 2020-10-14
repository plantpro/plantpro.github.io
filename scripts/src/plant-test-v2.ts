class Test extends HTMLElement {
  private current: number;
  private score: number;

  constructor() {
    super();

    this.current = 0;
    this.score = 0;
  }

  nextQuestion(score: number) {
    this.score += score;

    if (this.current >= this.children.length) {
      this.innerHTML = "Score: " + this.score + "/" + (this.childNodes.length - 1);
      return;
    }

    let q = this.children[this.current] as Question;
    q.onAnswer(this.nextQuestion.bind(this));
    q.style.display = 'block';

    this.current++;
  }
}

abstract class Question extends HTMLElement {
  abstract onAnswer(handler: (score: number) => void): void;
  abstract checkAnswer();

  private btn: HTMLButtonElement;

  constructor() {
    super();

    this.btn = document.createElement("button");
    this.btn.innerText = "Проверить";
    this.btn.addEventListener("click", this.checkAnswer.bind(this));

    this.appendChild(this.btn);
  }
}

abstract class VariantQuestion extends Question {
  protected onAnswerHandler: (isCorrect: number) => void;

  constructor() {
    super();
  }

  onAnswer(handler: (isCorrect: number) => void) {
    this.onAnswerHandler = handler;
  }

  abstract checkAnswer(): void;
}
/*
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
*/
class SingleQuestion extends VariantQuestion {
  constructor() {
    super();
  }

  getAnswerByNumber(number: number): Element {
    let answers = document.querySelectorAll(".answer");
    for (const answer of answers) {
      let no = parseInt((answer.querySelector(".answer-no") as HTMLSpanElement).innerText);
      if (no === number) {
        return answer;
      }
    }
  }

  hightlightAnswers() {
  /*  if (this.selected === this.rightAnswerNumber) {
      this.getAnswerByNumber(this.selected).classList.add("correct-answer");
    } else {
      this.getAnswerByNumber(this.rightAnswerNumber).classList.add("correct-answer");
      this.getAnswerByNumber(this.selected).classList.add("wrong-answer");
    }*/
  }

  flag = false;

  checkAnswer() {
    if (!this.flag) {
      this.hightlightAnswers();
      (document.querySelector("#next-button") as HTMLButtonElement).innerText = "Далее";
      this.flag = true;
    } else {
     /* if (this.selected === this.rightAnswerNumber) {
        this.onAnswerHandler(1);
      } else {
        this.onAnswerHandler(0);
      }*/
    }
  }

  selectAnswer(event: { target: Element }) {
  /*  if (this.selected != null) {
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
    }*/
  }
}
/*
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
*/
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

customElements.define("plant-test", Test);
customElements.define("plant-single-question", SingleQuestion);