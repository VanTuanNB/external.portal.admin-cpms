/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class AuthService extends BaseCoreService {
    constructor() {
        super();
    }

    public login(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.auth.login, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
