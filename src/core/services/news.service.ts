/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseCoreService } from './base-core.service';
import { API_DOCUMENT } from './endpoint/index.enpoint';
import { IParamsRequestApi } from './models/base-core.model';

export class NewsService extends BaseCoreService {
    constructor() {
        super();
    }

    public getList(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.news.getList, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public getById(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.news.getById, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public create(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.news.create, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public update(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.news.update, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }

    public delete(option: IParamsRequestApi): void {
        this.requestApiWithAuth(API_DOCUMENT.news.delete, option)
            .then((res) => option.onSuccess(res))
            .catch((err) => option.onError(err));
    }
}
