import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppConfigModel} from "../model/model";

@Injectable()
export class AppConfigService {

  public keycloakUrl: string;
  public keycloakRealm: string;
  public keycloakClientId: string;

  constructor(
    private readonly httpClient: HttpClient
  ) {
    this.keycloakUrl = '';
    this.keycloakRealm = '';
    this.keycloakClientId = '';
  }

  public loadAppConfig(): Promise<AppConfigModel> {
    return new Promise((resolve, reject) => {

      this.httpClient.get<AppConfigModel>('./assets/conf/appConfig.json')
        .subscribe((content: AppConfigModel) => {
            Object.assign(this, content);
            resolve(this);
          },
          reason => reject(reason)
        );
    });

  }
}
