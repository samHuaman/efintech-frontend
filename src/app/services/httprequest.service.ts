import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, URLSearchParams, ResponseContentType } from "@angular/http"
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { Observable } from "rxjs"

@Injectable()
export class HttpRequestService {

    progress: any;
    progress$: any;
    progressObserver: any;

    constructor(private router: Router, 
                private http: Http,
                private sanitizer: DomSanitizer) {
        this.progress$ = Observable.create(observer => {
            this.progressObserver = observer
        }).share();
    }

    get(url: string): Observable<any> {
        return this.http.get(url)
                .map(res => res)
                .catch(err => {
                    if (err.status === 401 || err.status === 503) {
                        return this.unauthorised();
                    }
                    else if (err.status === 403) {
                        return this.forbidden();
                    }
                    else {
                        return Observable.throw(err);
                    }
                });
    }

    post(url: string, params: URLSearchParams): Observable<any> {
        return this.http.post(url, params)
                .map(res => res)
                .catch(err => {
                    if (err.status === 401 || err.status === 503) {
                        return this.unauthorised();
                    }
                    else if (err.status === 403) {
                        return this.forbidden();
                    }
                    else {
                        return Observable.throw(err);
                    }
                });
    }

    getWithCredentials(url: string): Observable<any> {
        return this.http.get(url, { withCredentials: true })
                .map(res => res)
                .catch(err => {
                    if (err.status === 401 || err.status === 503) {
                        return this.unauthorised();
                    }
                    else if (err.status === 403) {
                        return this.forbidden();
                    }
                    else {
                        return Observable.throw(err);
                    }
                });
    }

    postWithCredentials(url: string, params: URLSearchParams): Observable<any> {
        return this.http.post(url, params, { withCredentials: true })
                .map(res => res)
                .catch(err => {
                    if (err.status === 401 || err.status === 503) {
                        return this.unauthorised();
                    }
                    else if (err.status === 403) {
                        return this.forbidden();
                    }
                    else {
                        return Observable.throw(err);
                    }
                });
    }

    getImageWithCredentials(url: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'image/jpg');

        return this.http.get(url, { 
                                    withCredentials: true, 
                                    headers: headers, 
                                    responseType: ResponseContentType.Blob
                                  })
                    .map(res => {
                        return new Blob([res["_body"]], {
                            type: res.headers.get("Content-Type")
                        });
                    })
                    .map(blob => {
                        var urlCreator = window.URL;
                        return this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
                    });
    }

    postFileWithCredentials(url: string, params: string[], files: File[]): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            let size: any = (files[0].size / 1024).toFixed(2);
            console.log(size);

            if (size > 12000) {
                observer.error('SIZE');
                return;
            }

            formData.append(params[0], params[1]);
            formData.append('file', files[0], files[0].name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(xhr.response);
                        observer.complete();
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                this.progressObserver.next(this.progress);
            };
            
            xhr.withCredentials = true;
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }

    unauthorised() {
        this.http
        .get('http://localhost.com:8080/logout', { withCredentials: true })
        .subscribe(data => {
                localStorage.removeItem('currentUser');
                this.router.navigate(['/login']);
        }, error => {
            console.log(error);
        });

        return Observable.empty();
    }

    forbidden() {
        this.router.navigate(['/']);
        return Observable.empty();
    }

}