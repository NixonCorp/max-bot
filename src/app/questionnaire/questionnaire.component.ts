import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
import {Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  profileForm = new FormGroup({
    firstNameAndMiddleName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    mobilePhone: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    citizenship: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    purpose: new FormControl('', Validators.required),
  });
  isPrinting = true;
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  currentQuestionnaireList = [];
  currentAnswerButtons = [];
  questionnaire = {
    questionnaireList: [
      {
        id: 0,
        type: 'image',
        src: 'assets/images/start_video.gif',
        style: 'height: 30%; width: 30%;',
        avatar: false
      },
      {
        id: 0,
        type: 'audio',
        src: [
          {
            src: 'https://botapi.vekrosta.ru/media/%D0%91%D0%BE%D1%82_%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%823_xWEeowY.m4a',
            type: 'audio/mp3',
          }
        ],
        avatar: false
      },
      {
        id: 0,
        type: 'text',
        src: ['Привет, меня зовут МАКС. Я буду помогать тебе. У меня для тебя есть предложение, но сначала давай знакомиться.'],
        avatar: true
      },
      {
        id: 0,
        type: 'text',
        src: ['Тебе есть 18 лет?'],
        avatar: true
      },
      {
        id: 1,
        type: 'text',
        src: ['Извини <span class="ql-emojiblot" style="\n' +
        '    display: none;\n' +
        '">&#65279;<span><span class="ap ap-pray">?</span></span>&#65279;</span>&#65279;, у меня деловое предложение ТОЛЬКО для тех, кому 18 лет или старше.', '<br>', 'Но ты можешь воспользоваться нашим предложением в будущем, либо дать возможность своим более взрослым родственникам или друзьям.', '<br>', 'А пока можешь продолжить и проявить интерес к новой теме <span class="ql-emojiblot">&#65279;<span><span class="ap ap-nerd_face">?</span></span>&#65279;</span>'],
        avatar: true
      },
      {
        id: 2,
        type: 'text',
        src: ['Как ты думаешь, что тебе ждет в будущем?'],
        avatar: true
      },
    ],
    answers: [{
      id: 0,
      buttons: [{relatedId: 2, src: 'Да'}, {relatedId: 1, src: 'Нет, мне меньше 18 лет'}]
    },
      {
        id: 2,
        buttons: [{relatedId: 3, src: 'Верю в свое будущее. Будет только лучше.'}, {
          relatedId: 4,
          src: 'Все будет намного сложнее, чем сегодня'
        }]
      },
      {
        id: 1,
        buttons: [{relatedId: 2, src: 'Вперед'}]
      }
    ]
  };

  constructor() {
  }

  ngOnInit(): void {
    this.loadData(0);
  }

  // tslint:disable-next-line:typedef
  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }

  // tslint:disable-next-line:typedef
  async loadData(id: number, userAnswerStr: string = null) {
    if (userAnswerStr) {
      const userAnswer = {
        type: 'userAnswer',
        src: userAnswerStr
      };
      this.currentQuestionnaireList.push(userAnswer);
    }
    this.currentAnswerButtons = [];
    this.isPrinting = true;
    await this.delay(1000);
    let filteredQuestionnaireList = this.questionnaire.questionnaireList.filter(x => x.id === id);
    this.currentQuestionnaireList.push(filteredQuestionnaireList[0]);
    if (filteredQuestionnaireList.length > 1) {
      filteredQuestionnaireList = filteredQuestionnaireList.filter(x => x !== filteredQuestionnaireList[0]);
      for (const question of filteredQuestionnaireList) {
        this.isPrinting = true;
        if (question.type === 'text') {
          await this.delay(3000);
          this.isPrinting = false;
          this.currentQuestionnaireList.push(question);
        } else {
          await this.delay(1000);
          this.isPrinting = false;
          this.currentQuestionnaireList.push(question);
        }
      }
    } else {
      this.isPrinting = false;
    }

    this.currentAnswerButtons = this.questionnaire.answers.find(x => x.id === id).buttons;
    setTimeout(() => {
      document.getElementsByClassName('answers')[0].scrollIntoView();
    }, 10);
  }

  plyrReady(): void {
    this.plyr.player.play();
  }

  plyrEnded(): void {
    setTimeout(() => {
      this.plyr.player.stop();
    }, 200);

  }


}
