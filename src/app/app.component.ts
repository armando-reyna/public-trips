import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from 'ionic-native';

import { TravelsLoginPage } from '../pages/travels-login/travels-login';
import { TravelsTabsPage } from '../pages/travels-tabs/travels-tabs';
import { TravelsInvoicesRecipePage } from '../pages/travels-invoices-recipe/travels-invoices-recipe'

import { TravelsService } from '../providers/travels-service';
import { LoadingMessages } from '../helpers/loading';

declare var cordova: any;
declare var IntentPlugin: any;
declare var window: any;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private loadingMessages: LoadingMessages,
        public travelsService: TravelsService
    ) {
        console.log('CONSTRUCTOR app.component');
        platform.ready()
        .then(() => {
            this.splashScreen.show();
            this.rootPage = TravelsLoginPage;
            platform.is('android') ? this.manageAndroid() : this.manageIOS();
        });
    }

    public clearScreen(): void {
        // this.statusBar.hide();
        // this.statusBar.backgroundColorByHexString('#000');
        this.statusBar.overlaysWebView(false);
        // this.statusBar.styleLightContent();
        this.statusBar.styleDefault();
        this.splashScreen.hide();
    }

    public openApp(): void {
        NativeStorage.getItem('currentUser')
        .then(responseUser => {
            this.rootPage = TravelsTabsPage;
            this.clearScreen();
        })
        .catch(errorUser => {
            this.rootPage = TravelsLoginPage;
            this.clearScreen();
        });
        this.loadingMessages.hide(0);
        // Clean the screen: statusBar and splashScreen
        // Check the user session
    }

    public openInvoiceRecipe(intent): void {
        NativeStorage.setItem('fileUpload', JSON.stringify(intent))
        .then(responseStorage => { this.rootPage = TravelsInvoicesRecipePage; });
    }

    public uploadInvoice(formFile, type) {
        NativeStorage.getItem('tSessionToken')
        .then(responseToken => {
            this.loadingMessages.create('Enviando evidencia');
            this.openApp();
            this.travelsService.uploadEvidence(formFile, '')
            .subscribe(responseUpload => {
                console.log('responseUpload::::::::::::::', responseUpload);
            }, errorUpload => {
                console.log('errorUpload::::::::::::::', errorUpload);
            });
        })
        .catch(errorToken => {
            console.log('errorToken::::::::::::::', errorToken);
            this.openApp();
        });
    }

    public openFile(intent) {
        // TODO: Analize user session

        // Set constants File
        const typeFile = intent.type;
        const extFile = typeFile.split("/")[1];

        IntentPlugin.getRealPathFromContentUrl(intent.data, function (success) {}, function (error) {});

        window.resolveLocalFileSystemURL(intent.data, (fileEntry) => {
            fileEntry.file(responseFile => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const formData = new FormData();
                    let imgBlob = new Blob([reader.result], { type: typeFile });
                    imgBlob['name'] = responseFile.name;
                    formData.append('file', imgBlob, responseFile.name);
                    this.uploadInvoice(formData, extFile);
                };
                reader.readAsArrayBuffer(responseFile);
            });
        })
    }

    public manageAndroid(): void {
        IntentPlugin.setNewIntentHandler( function (intent) {} );

        // Get Intent content
        IntentPlugin.getCordovaIntent(intent => {
            console.log('INTENT', intent);
            intent['action'] === 'android.intent.action.VIEW'
                // ? this.openInvoiceRecipe(intent)
                ? this.openFile(intent)
                : this.openApp();
        }, errorIntent => {
            console.error('-- errorIntent', errorIntent);
        });
    }

    public manageIOS(): void {
        // Increase verbosity if you need more logs
        cordova.openwith.setVerbosity(cordova.openwith.DEBUG);

        // Initialize the plugin
        cordova.openwith.init(initSuccess, initError);

        function initSuccess()  { console.log('Share extension success!'); }
        function initError(err) { console.log('Share extension failed: ' + err); }

        // Define your file handler
        cordova.openwith.addHandler(intent => {
            console.log('intent received');

            console.log('  action: ' + intent.action); // type of action requested by the user
            console.log('  exit: ' + intent.exit); // if true, you should exit the app after processing

            for (var i = 0; i < intent.items.length; ++i) {
                var item = intent.items[i];
                console.log('  type: ', item.type);   // mime type
                console.log('  uri:  ', item.uri);     // uri to the file, probably NOT a web uri

                // some optional additional info
                console.log('  text: ', item.text);   // text to share alongside the item, iOS only
                console.log('  name: ', item.name);   // suggested name of the image, iOS 11+ only
                console.log('  utis: ', item.utis);
                console.log('  path: ', item.path);   // path on the device, generally undefined
            }

            if (intent.items.length > 0) {
                cordova.openwith.load(intent.items[0], function(data, item) {
                    // data is a long base64 string with the content of the file
                    console.log("the item weights " + data.length + " bytes");
                    // uploadToServer(item);
                    // "exit" when done.
                    // Note that there is no need to wait for the upload to finish,
                    // the app can continue while in background.
                    if (intent.exit) { cordova.openwith.exit(); }
                });
            }
            else {
                if (intent.exit) {    
                    cordova.openwith.exit();
                }
            }
        });
        this.openApp();
    }

    ionViewWillEnter() {}
}
