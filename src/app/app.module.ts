import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';
import { MaterialIconsModule } from 'ionic2-material-icons';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { DatePicker } from '@ionic-native/date-picker';


// Pages
import { TravelsCreateEventsPage } from '../pages/travels-create-events';
import { TravelsDetailEventsPage } from '../pages/travels-detail-events';
import { TravelsExpensesCreatePage } from '../pages/travels-expenses-create';
import { TravelsExpensesDetailPage } from '../pages/travels-expenses-detail';
import { TravelsExpensesTransactionPage } from '../pages/travels-expenses-transaction';
import { TravelsExpensesTypePage } from '../pages/travels-expenses-type';
import { TravelsFirstPasswordPage } from '../pages/travels-first-password';
import { TravelsHomePage } from '../pages/travels-home';
import { TravelsInvoicesRecipePage } from '../pages/travels-invoices-recipe';
import { TravelsListEventsPage } from '../pages/travels-list-events';
import { TravelsListExpensesPage } from '../pages/travels-list-expenses';
import { TravelsInvoicesListPage } from '../pages/travels-invoices-list';
import { TravelsListMovementsPage } from '../pages/travels-list-movements';
import { TravelsListTransactionsPage } from '../pages/travels-list-transactions';
import { TravelsLoginPage } from '../pages/travels-login';
import { TravelsProfilePage } from '../pages/travels-profile';
import { TravelsRecoveryPage } from '../pages/travels-recovery';
import { TravelsSelectExpensesPage } from '../pages/travels-select-expenses';
import { TravelsInvoicesSelectPage } from '../pages/travels-invoices-select';
import { TravelsTabsPage } from '../pages/travels-tabs';
import { TravelsTransactionsDetailPage } from '../pages/travels-transactions-detail';
import { TravelsSendEmailPage } from '../pages/travels-send-email';
import { TravelsInvoicesDetailPage } from '../pages/travels-invoices-detail/travels-invoices-detail';
import { TravelsApprovalsEventsPage } from '../pages/travels-approvals-events';
import { TravelsApprovalsAdvancesPage } from '../pages/travels-approvals-advances';
import { TravelsApprovalsPage } from '../pages/travels-approvals';
import { TravelsAdvancesPage } from '../pages/travels-advances';
import { TravelsAdvancesCreatePage } from '../pages/travels-advances-create';
import { TravelsAdvancesDetailPage } from '../pages/travels-advances-detail';

import { LoaderComponent } from '../components/loader';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { ToastMessages } from '../helpers/toast';
import { AppConstants } from '../helpers/constants';
import { TravelsConstants } from '../helpers/travels-constants';
import { LoadingMessages } from '../helpers/loading';
import { TravelsService } from '../providers/travels-service';
import { AdvancesProvider } from '../providers/advances/advances';



@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    TravelsCreateEventsPage,
    TravelsDetailEventsPage,
    TravelsExpensesCreatePage,
    TravelsExpensesDetailPage,
    TravelsExpensesTransactionPage,
    TravelsExpensesTypePage,
    TravelsFirstPasswordPage,
    TravelsHomePage,
    TravelsInvoicesRecipePage,
    TravelsListEventsPage,
    TravelsListExpensesPage,
    TravelsInvoicesListPage,
    TravelsListMovementsPage,
    TravelsListTransactionsPage,
    TravelsLoginPage,
    TravelsProfilePage,
    TravelsRecoveryPage,
    TravelsSelectExpensesPage,
    TravelsInvoicesSelectPage,
    TravelsTabsPage,
    TravelsTransactionsDetailPage,
    TravelsSendEmailPage,
    TravelsInvoicesDetailPage,
    TravelsApprovalsEventsPage,
    TravelsApprovalsAdvancesPage,
    TravelsApprovalsPage,
    TravelsAdvancesPage,
    TravelsAdvancesCreatePage,
    LoaderComponent,
    TravelsAdvancesDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MaterialIconsModule,
    FormsModule,
    TextMaskModule,
    IonicModule.forRoot(MyApp, {
        mode: 'md',
        tabsHideOnSubPages: true,
        swipeBackEnabled: false,
        scrollAssist: true,
        autoFocusAssist: true,
        backButtonText: 'Atrás',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        monthShortNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ]
    }, { links: [] })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    TravelsCreateEventsPage,
    TravelsDetailEventsPage,
    TravelsExpensesCreatePage,
    TravelsExpensesDetailPage,
    TravelsExpensesTransactionPage,
    TravelsExpensesTypePage,
    TravelsFirstPasswordPage,
    TravelsHomePage,
    TravelsInvoicesRecipePage,
    TravelsListEventsPage,
    TravelsListExpensesPage,
    TravelsInvoicesListPage,
    TravelsListMovementsPage,
    TravelsListTransactionsPage,
    TravelsLoginPage,
    TravelsProfilePage,
    TravelsRecoveryPage,
    TravelsSelectExpensesPage,
    TravelsInvoicesSelectPage,
    TravelsTabsPage,
    TravelsTransactionsDetailPage,
    TravelsSendEmailPage,
    TravelsInvoicesDetailPage,
    TravelsApprovalsEventsPage,
    TravelsApprovalsAdvancesPage,
    TravelsApprovalsPage,
    TravelsAdvancesPage,
    TravelsAdvancesCreatePage,
    LoaderComponent,
    TravelsAdvancesDetailPage
  ],
  providers: [
    StatusBar,
    Keyboard,
    SplashScreen,
    ToastMessages,
    TravelsConstants,
    AppConstants,
    LoadingMessages,
    TravelsService,
    DatePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AdvancesProvider
  ]
})
export class AppModule { }
