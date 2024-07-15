import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Website } from './website';
import { Observable, catchError, tap, map, throwError } from 'rxjs';
import { Page } from './page';


@Injectable({
    providedIn: 'root'
})
export class WebsiteService {
    private jsonUrl = 'assets/report.json';

    getReport(): Observable<any> {
        return this.http.get<any>(this.jsonUrl);
    }

    //private websitesUrl = 'http://localhost:3067/websites';
    //private websiteUrl = 'http://localhost:3067/website';
    //private pagesUrl = 'http://localhost:3067/pages';
    private websitesUrl = 'http://appserver.alunos.di.fc.ul.pt:3067/websites';
    private websiteUrl = 'http://appserver.alunos.di.fc.ul.pt:3067/website';
    private pagesUrl = 'http://appserver.alunos.di.fc.ul.pt:3067/pages';
    messageService: any;

    constructor(private http: HttpClient) { }

    getWebsites(): Observable<Website[]> {
        return this.http.get<Website[]>(this.websitesUrl).pipe(
            tap(_ => console.log('Fetched Websites')),
            catchError(error => {
                throw new Error('Error searching websites: ' + error);
            })
        );

    }

    getWebsite(id: string): Observable<Website[]> {
        const request = `${this.websitesUrl}/?id=${id}`

        return this.http.get<Website[]>(request).pipe(
            tap(_ => console.log(`Fetched Website (${id})`)),
            catchError(error => {
                throw new Error('Error searching website: ' + error);
            })
        );
    }


    addWebsite(url: string): Observable<Website> {
        return this.http.post<Website>(this.websiteUrl, { url }).pipe(
            map(res => {
                return res;
            }),
            catchError(error => {

                if (error.status == 400) {
                    return throwError('Website already exists');
                }
                throw new Error('Error adding website: ' + error);
            })
        );

    }

    getPages(websiteId: string): Observable<Page[]> {
        const request = `${this.websiteUrl}/${websiteId}`;
        console.log(request);
        return this.http.get<Page[]>(request).pipe(
            catchError(error => {
                throw new Error(`Error searching pages: ` + error);
            })
        );
    }


    addPageToWebsite(websiteId: string, pageUrl: string): Observable<Page> {

        const request = `${this.websitesUrl}/${websiteId}`;
        console.log(request);

        return this.http.put<Page>(request, { url: pageUrl }).pipe(
            tap((newPage: Page) => {
                return newPage;
            }),
            catchError(error => {
                if (error.status == 400) {
                    return throwError('Page already exists');
                }
                throw new Error('Error adding page: ' + error);
            }
            )
        );
    }


    getPage(id: Page): Observable<Page> {
        const request = `${this.pagesUrl}/${id}`

        return this.http.get<Page>(request).pipe(
            tap(_ => console.log(request)),
            catchError(error => {
                throw new Error('Error searching page: ' + error);
            })
        );

    }

    deleteWebsite(websiteId: string): Observable<Website> {
        console.log('delete website')
        const request = `${this.websiteUrl}/${websiteId}`
        console.log(request)
        return this.http.delete<Website>(request).pipe(
            tap(_ => console.log(`Deleted Website (${websiteId})`)),
            catchError(error => {
                throw new Error('Error deleting website: ' + error);
            })
        );

    }


    deletePage(websiteId: string, pageId: string): Observable<Website> {
        console.log('delete page', pageId);
        console.log('website ', websiteId);
        const request = `${this.websiteUrl}/${websiteId}/${pageId}`;
        console.log(request);
        return this.http.delete<Website>(request).pipe()
    };

    evaluatePage(websiteId: string, pageId: string): Observable<Website> {
        console.log('Evaluate Page');
        console.log('Website id:', websiteId);
        console.log('Page Id:', pageId);

        const request = `${this.websiteUrl}/evaluate/${websiteId}/${pageId}`;
        return this.http.put<Website>(request, {}).pipe(
            tap(_ => console.log(`Evaluate page ( ${pageId})`)),
            catchError(error => {
                throw new Error('Error evaluating page: ' + error);
            })
        );

    };


    evaluatePages(websiteId: string, pagesId: string[]) {
        for (const page of pagesId) {
            this.evaluatePage(websiteId, page);
        }
    };

    top10Errors(websiteId: string): Observable<Website> {
        console.log('Top 10 Errors');
        console.log(websiteId);
        const request = `${this.websiteUrl}/top10/${websiteId}`;
        return this.http.get<Website>(request).pipe(
            tap(_ => console.log(`Top 10 Errors (${websiteId})`)),
            catchError(error => {
                throw new Error('Error getting top 10 errors ' + error);
            })
        );
    };

    getPageReport(websiteId: string, page: Page): Observable<Page> {
        console.log('Get Page Report');
        console.log(page);
        const request = `${this.websiteUrl}/${websiteId}/${page._id}/report`;
        return this.http.get<Page>(request).pipe(
            tap(_ => console.log(`Get Page Report (${page._id})`)),
            catchError(error => {
                throw new Error('Error getting page report' + error);
            }));
    }

    getPageReportById(websiteId: string, pageId: string): Observable<Page> {
        console.log('Get Page Report');
        console.log(pageId);
        const request = `${this.websiteUrl}/${websiteId}/${pageId}/report`;
        return this.http.get<Page>(request).pipe(
            tap(_ => console.log(`Get Page Report (${pageId})`)),
            catchError(error => {
                throw new Error('Error getting page report' + error);
            }));
    }

    /** Log a WebsiteService message with the MessageService */
    private log(message: string) {
        this.messageService.add(`WebsiteService: ${message}`);
    }
}
