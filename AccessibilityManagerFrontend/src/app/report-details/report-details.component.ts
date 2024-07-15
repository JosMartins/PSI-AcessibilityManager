import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { WebsiteService } from '../website.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export interface Teste {
  name: string;
  code: string;
  description: string;
  results: Result[] | null;
  status: string;
  type: "act-rule" | "wcag-technique";
  conformity: string[];
}

export interface Result {
  verdict: string;
  description: string;
  resultCode: string;
  pointer?: string;
  htmlCode?: string;
}

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css'],
  // https://material.angular.io/components/table/examples#table-expandable-rows
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReportDetailsComponent implements OnInit {
  dataSource: any | MatTableDataSource<Teste>;
  expandedElement: any | Teste | null;

  @ViewChild(MatSort) sort: any | MatSort;
  @ViewChild(MatPaginator) paginator: any | MatPaginator;

  displayedColumns: string[] = ['name', 'code', 'description', 'conformity', 'status', 'type'];
  displayedColumnsWithExpand: string[] = [...this.displayedColumns, 'expand'];

  types: string[] = ['All', 'act-rule', 'wcag-technique'];
  statuses: string[] = ['All', 'passed', 'failed', 'inapplicable', 'warning'];

  htmlContent: { [key: string]: string } = {};
  showFullContent: { [key: string]: boolean } = {};


  selectedType: string = 'All';
  selectedStatus: string = 'All';
  selectedConformities: { A: boolean, AA: boolean, AAA: boolean } = { A: true, AA: true, AAA: true };

  passedTests = 0;
  warningTests = 0;
  failedTests = 0;
  notapplicableTests = 0;
  totalTests = 1;

  pageName = "######"

  getPercentage(n_tests: number) {
    const percentage = (100 * n_tests) / this.totalTests

    // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
    // round to 2 decimals
    return Math.round((percentage + Number.EPSILON) * 100) / 100

  }

  constructor(private route: ActivatedRoute,
    private websiteService: WebsiteService, private cdr: ChangeDetectorRef, private location: Location) { }

  ngOnInit(): void {

    this.getRules();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort

  }
  applyFilter() {
    if (this.dataSource) {
      const filterType = this.selectedType || 'All';
      const filterStatus = this.selectedStatus || 'All';

      // Get the selected conformities as an array of strings
      const filterConformities: string[] = [];
      if (this.selectedConformities.A) filterConformities.push('A');
      if (this.selectedConformities.AA) filterConformities.push('AA');
      if (this.selectedConformities.AAA) filterConformities.push('AAA');

      const filterObject = {
        type: filterType,
        status: filterStatus,
        conformities: filterConformities
      };

      this.dataSource.filter = JSON.stringify(filterObject);

      this.dataSource.filterPredicate = (data: Teste, filter: string): boolean => {
        const filterObj = JSON.parse(filter);
        const typeMatch = filterObj.type === 'All' || data.type === filterObj.type;
        const statusMatch = filterObj.status === 'All' || data.status === filterObj.status;

        // Check if the data.conformity includes all selected conformities
        const conformityMatch = filterObj.conformities.some((conf: string) =>
          data.conformity.includes(conf)
        );

        return typeMatch && statusMatch && conformityMatch;
      };
      this.dataSource.filter = this.dataSource.filter;
    }
  }

  loading: boolean = true;

  getRules() {
    const websiteId = this.route.snapshot.paramMap.get('websiteId');
    const pageId = this.route.snapshot.paramMap.get('pageId');

    if (pageId == null || websiteId == null) {
      return;
    }

    this.websiteService.getPageReportById(websiteId, pageId).subscribe((data: any) => {

      this.loading = false;

      this.pageName = Object.keys(data)[0]
      data = data[this.pageName]

      this.passedTests = data.metadata.passed;
      this.failedTests = data.metadata.failed;
      this.warningTests = data.metadata.warning;
      this.notapplicableTests = data.metadata.inapplicable;
      this.totalTests = this.passedTests + this.failedTests + this.warningTests + this.notapplicableTests;

      let parsedTests: Teste[] = [];

      if (data.modules['act-rules'] && data.modules['act-rules'].assertions) {

        let actRulesAssertions: any[] = [];
        actRulesAssertions = Object.values(data.modules['act-rules'].assertions);

        for (let i = 0; i < actRulesAssertions.length; i++) {

          const test = actRulesAssertions[i];
          let results = this.parseResults(test.results);
          let conformities = this.getConformityLevels(test);

          let t: Teste = {
            name: test.name as string,
            code: test.code as string,
            description: test.description as string,
            results: results,
            status: test.metadata.outcome,
            conformity: conformities,
            type: 'act-rule'
          };

          parsedTests.push(t);
        }
      }

      if (data.modules['wcag-techniques'] && data.modules['wcag-techniques'].assertions) {

        let wcagTechniquesAssertions: any[] = [];
        wcagTechniquesAssertions = Object.values(data.modules['wcag-techniques'].assertions);

        for (let i = 0; i < wcagTechniquesAssertions.length; i++) {

          const test = wcagTechniquesAssertions[i];
          let results = this.parseResults(test.results);
          let conformities = this.getConformityLevels(test);

          let t: Teste = {
            name: test.name as string,
            code: test.code as string,
            description: test.description as string,
            results: results,
            status: test.metadata.outcome,
            conformity: conformities,
            type: 'wcag-technique'
          };

          parsedTests.push(t);
        }
      }

      this.dataSource = new MatTableDataSource(parsedTests);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.applyFilter();
      this.cdr.detectChanges();

      // the ngIf messes with Angular's component lifecycle
      // and the paginator and sort don't work properly
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(parsedTests);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.applyFilter();
      });
    });
  }

  getConformityLevels(rule: any) {
    let success_criteria = rule['metadata']['success-criteria'];

    let conformities: string[] = []
    let A_seen = false;
    let AA_seen = false;
    let AAA_seen = false;

    for (let i = 0; i < success_criteria.length; i++) {

      if (success_criteria[i].level.trim() == "A" && !A_seen) {
        conformities.push("A");
        A_seen = true;
      }
      if (success_criteria[i].level === "AA" && !AA_seen) {
        conformities.push("AA");
        AA_seen = true;
      }
      if (success_criteria[i].level === "AAA" && !AAA_seen) {
        conformities.push("AAA");
        AAA_seen = true;
      }
    }
    return conformities;
  }

  parseResults(results: any): Result[] | null {
    try {
      const parsedResults: Result[] = results.map((result: any) => {
        const { verdict, description, resultCode, elements } = result;
        if (elements && elements.length > 0) {
          return elements.map((element: any) => ({
            verdict,
            description,
            resultCode,
            pointer: element.pointer.replace(/[\s\n]{2,}/g, ' '), // regex to remove whitespaces and newlines
            htmlCode: element.htmlCode.replace(/[\s\n]{2,}/g, ' '),
            accessibleName: element.accessibleName
          }));
        } else {
          return {
            verdict,
            description,
            resultCode
          };
        }
      }).flat();

      return parsedResults;
    } catch (error) {
      console.error("Error parsing results:", error);
      return null;
    }

  }

  // Some Tests have a looot of elements
  // this is a diy paginator to show in increments of 10
  resultsPage: { [key: string]: number } = {};
  getResultsPage(test: Teste): Result[] {
    const pageIndex = this.resultsPage[test.code] || 1;  // Default to 1 if not set
    const pageSize = 10;

    let endIndex = 0;
    if (test.results) {
      endIndex = test.results.length;
    }
    const end = Math.min(pageIndex * pageSize, endIndex);
    return test.results ? test.results.slice(0, pageIndex * pageSize) : [];
  }

  showMoreResults(test: Teste): void {
    const pageIndex = this.resultsPage[test.code] || 1;  // Default to 1 if not set
    const pageSize = 10;
    let endIndex = 0;
    if (test.results) {
      endIndex = test.results.length;
    }
    const end = Math.min(pageIndex * pageSize, endIndex);

    if (!this.resultsPage[test.code]) {
      this.resultsPage[test.code] = 2;
    } else {
      this.resultsPage[test.code]++;
    }

    // para facilitar a navegacao com tab, queremos
    //  selecionar o primeiro dos novos testes mostrados
    //  mas para isso, precisamos de esperar que os novos testes renderizem
    this.cdr.detectChanges();
    setTimeout(() => {
      this.focusResult(end);
    });
  }

  @ViewChildren('resultContainer') resultContainers: any | QueryList<ElementRef>;
  focusResult(index: number): void {
    const resultArray = this.resultContainers.toArray();
    if (index >= 0 && index < resultArray.length) {
      resultArray[index].nativeElement.focus();
    }
  }

  getConformityClass(item: string): string {
    switch (item) {
      case 'A':
        return 'conformity-item-A';
      case 'AA':
        return 'conformity-item-AA';
      case 'AAA':
        return 'conformity-item-AAA';
      default:
        return '';
    }
  }

  goBack() {
    this.location.back();
  }

  getHtmlCodePreview(result: Result, testCode: string): string {
    if (!this.showFullContent[testCode]) {
      this.showFullContent[testCode] = false;
    }
  
    if (!result.htmlCode) {
      return '';
    }
  
    if (result.htmlCode.length <= 200 || this.showFullContent[testCode]) {
      return result.htmlCode;
    } else {
      return result.htmlCode.slice(0, 200) + '...';
    }
  }
  
  toggleShowFullContent(testCode: string): void {
    this.showFullContent[testCode] = !this.showFullContent[testCode];
  }
}
