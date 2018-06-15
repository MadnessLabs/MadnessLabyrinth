import config from '../global/environment';

export class ConfigService {
  public get(name: string) {
    return config[name];
  }
}
