class Test extends HTMLElement {
    constructor() {
        super();
        this.current = 0;
        this.score = 0;
        this.addEventListener("loadstart", () => {
            console.log("X");
            this.nextQuestion(0);
        });
    }
    nextQuestion(score) {
        this.score += score;
        if (this.current >= this.children.length) {
            this.innerHTML = "Score: " + this.score + "/" + (this.childNodes.length - 1);
            return;
        }
        let q = this.children[this.current];
        q.onAnswer(this.nextQuestion.bind(this));
        q.style.display = 'block';
        this.current++;
    }
}
class Question extends HTMLElement {
    constructor() {
        super();
        this.btn = document.createElement("button");
        this.btn.innerText = "Проверить";
        this.btn.addEventListener("click", this.checkAnswer.bind(this));
        this.appendChild(this.btn);
    }
}
class VariantQuestion extends Question {
    constructor() {
        super();
    }
    onAnswer(handler) {
        this.onAnswerHandler = handler;
    }
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
        this.flag = false;
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
        /*  if (this.selected === this.rightAnswerNumber) {
            this.getAnswerByNumber(this.selected).classList.add("correct-answer");
          } else {
            this.getAnswerByNumber(this.rightAnswerNumber).classList.add("correct-answer");
            this.getAnswerByNumber(this.selected).classList.add("wrong-answer");
          }*/
    }
    checkAnswer() {
        if (!this.flag) {
            this.hightlightAnswers();
            document.querySelector("#next-button").innerText = "Далее";
            this.flag = true;
        }
        else {
            /* if (this.selected === this.rightAnswerNumber) {
               this.onAnswerHandler(1);
             } else {
               this.onAnswerHandler(0);
             }*/
        }
    }
    selectAnswer(event) {
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
customElements.define("plant-test", Test);
customElements.define("plant-single-question", SingleQuestion);
