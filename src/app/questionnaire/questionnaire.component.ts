import {Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PlyrComponent} from 'ngx-plyr';
import {Subscription} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigService} from '../config.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import * as Plyr from 'plyr';

const moment = _moment;

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  providers: [{
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },

    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS},
  ]
})
export class QuestionnaireComponent implements OnInit {

  @ViewChild('errorDialogTemplate') errorDialog: TemplateRef<any>;
  @ViewChild('successDialogTemplate') successDialog: TemplateRef<any>;
  errorDialogImgSrc: string;
  errorDialogMessage: string;
  errorMessageDialogTitle: string;
  successMessageDialogTitle: string;
  successDialogImgSrc: string;
  successDialogMessage: string;
  profileForm = new FormGroup({
    firstNameAndMiddleName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl(''),
    mobilePhone: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
    citizenship: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    purpose: new FormControl('')
  });
  owner: string;
  whatsAppIsClicked = false;
  viberIsClicked = false;
  telegramIsClicked = false;
  formIsShown = false;
  isPrinting = true;
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;
  currentQuestionnaireList = [];
  currentAnswerButtons = [];
  questionnaire: any = {};
  policyChecked = false;
  audioOptions: Plyr.Options = {
    autoplay: false
  };
  videoOptions: Plyr.Options = {
    autoplay: false
  };

  constructor(private configService: ConfigService,
              private dateAdapter: DateAdapter<Date>,
              private dialog: MatDialog) {
    this.dateAdapter.setLocale('ru');
  }

  ngOnInit(): void {
    this.configService.getJSON().subscribe((json) => {
      this.questionnaire = json.questionnaire;
      this.successDialogImgSrc = this.questionnaire.successDialogImgSrc;
      this.successDialogMessage = this.questionnaire.successDialogMessage;
      this.successMessageDialogTitle = this.questionnaire.successMessageDialogTitle;
      this.errorDialogImgSrc = this.questionnaire.errorDialogImgSrc;
      this.errorDialogMessage = this.questionnaire.errorDialogMessage;
      this.errorMessageDialogTitle = this.questionnaire.errorMessageDialogTitle;
      this.loadData(0);
    });
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
    if (filteredQuestionnaireList.length > 0 &&
      filteredQuestionnaireList.find(x => x.type === 'form')) {
      this.formIsShown = true;
      if (filteredQuestionnaireList.length === 1) {
        this.isPrinting = false;
        return;
      }
    }
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
          if (question.type === 'audio' ||
            question.type === 'video') {
            question.mediaOptions = {
              autoplay: question.autoplay ? true : false
            };
          }
          await this.delay(1000);
          this.isPrinting = false;
          this.currentQuestionnaireList.push(question);
        }
      }
    } else {
      this.isPrinting = false;
    }

    this.currentAnswerButtons = this.questionnaire.answers.find(x => x.id === id) ? this.questionnaire.answers.find(x => x.id === id).buttons : [];
    setTimeout(() => {
      if (document.getElementsByClassName('answers') && document.getElementsByClassName('answers').length > 0) {
        document.getElementsByClassName('answers')[document.getElementsByClassName('answers').length - 1].scrollIntoView();
      }

    }, 10);
  }

  getErrorMessage(control: string): string {
    if (this.profileForm.get(control).hasError('required')) {
      return 'Необходимо ввести значение';
    }
  }

  plyrReady(): void {
    this.plyr.player.play();
  }

  plyrEnded(): void {
    setTimeout(() => {
      this.plyr.player.stop();
    }, 200);

  }


  mobilePhoneSuffix(event: MouseEvent): void {
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('whatsApp') !== -1 && !this.whatsAppIsClicked) {
      this.whatsAppIsClicked = !this.whatsAppIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#whatsApp')[0].style.fill = '#25D366';
      return;
    }
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('whatsApp') !== -1 && this.whatsAppIsClicked) {
      this.whatsAppIsClicked = !this.whatsAppIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#whatsApp')[0].style.fill = '#DCDCDC';
      return;
    }
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('viber') !== -1 && !this.viberIsClicked) {
      this.viberIsClicked = !this.viberIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#viber')[0].style.fill = '#665CAC';
      return;
    }
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('viber') !== -1 && this.viberIsClicked) {
      this.viberIsClicked = !this.viberIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#viber')[0].style.fill = '#DCDCDC';
      return;
    }
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('telegram') !== -1 && !this.telegramIsClicked) {
      this.telegramIsClicked = !this.telegramIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#telegram')[0].style.fill = '#0088cc';
      return;
    }
    // @ts-ignore
    if (event.target.className.baseVal.indexOf('telegram') !== -1 && this.telegramIsClicked) {
      this.telegramIsClicked = !this.telegramIsClicked;
      // @ts-ignore
      document.querySelectorAll('svg path#telegram')[0].style.fill = '#DCDCDC';
      return;
    }


  }

  register(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      const groupIds = this.questionnaire.groupIds.trim().split(',');
      let sentMessagesCount = 0;
      for (const groupId of groupIds) {
        let message = `Владелец формы: ${this.questionnaire.owner}%0A`;
        message += `Фамилия: ${this.profileForm.get('lastName').value}%0A`;
        message += `Имя, Отчество: ${this.profileForm.get('firstNameAndMiddleName').value}%0A`;
        if (this.profileForm.get('email').value) {
          message += `Электронная почта: ${this.profileForm.get('email').value}%0A`;
        }
        message += `Мобильный телефон: ${this.profileForm.get('mobilePhone').value}`;
        const phonesTypes = [];

        if (this.whatsAppIsClicked) {
          phonesTypes.push('WhatsApp');
        }
        if (this.viberIsClicked) {
          phonesTypes.push('Viber');
        }
        if (this.telegramIsClicked) {
          phonesTypes.push('Telegram');
        }
        if (phonesTypes.length > 0) {
          message += ' (';
          message += phonesTypes.join(', ');
          message += ')%0A';
        } else {
          message += '%0A';
        }
        message += `Дата рождения: ${moment(this.profileForm.get('birthDate').value).utcOffset(3).format('DD-MM-YYYY')}%0A`;
        message += `Гражданство: ${this.profileForm.get('citizenship').value}%0A`;
        message += `Страна: ${this.profileForm.get('country').value}%0A`;
        message += `Город: ${this.profileForm.get('city').value}%0A`;
        if (this.profileForm.get('purpose').value) {
          message += `Цель регистрации: ${this.profileForm.get('purpose').value}%0A`;
        }
        const allAnswers = this.currentQuestionnaireList.filter(x => x.type === 'userAnswer').map(x => x.src).join(', ');
        message += `Ответы: ${allAnswers}%0A`;
        message += `Url бота: ${document.URL}`;
        this.configService.register(message, this.questionnaire.botToken, groupId).subscribe(() => {
            sentMessagesCount++;
            if (sentMessagesCount === groupIds.length) {
              this.dialog.open(this.successDialog);
            }
          },
          error => {
            console.log(error);
            this.errorDialogMessage = error;
            this.dialog.open(this.errorDialog);
          });
      }

    }
  }
}
