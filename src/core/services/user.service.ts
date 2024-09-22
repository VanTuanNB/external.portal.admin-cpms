/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class UserService extends BaseCoreService {
    constructor() {
        super();
    }

    public getList(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.getList, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public getById(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.getById, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public create(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.create, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public approveCourse(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.approve, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public completeCourse(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.complete, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public update(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.update, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public delete(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.user.delete, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
