import { isDevMode, Injectable } from '@angular/core';

@Injectable()
export class AppConstants {

    constructor() {}

    // public travelsUrl: string = 'http://apidevinteliviajes.com/v1';
    // public travelsUrl: string = 'https://api.dev.inteliviajes.mx';

    // API URL for Inteliviajes
    public travelsUrl: string = isDevMode()
    // For dev environment
    ? 'https://api.dev.inteliviajes.mx'
    // For prod environment
    : 'https://api.uat.inteliviajes.mx';

}
