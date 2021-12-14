import { AdminService } from './../../../service/admin.service';
import { ShortVacanciesWithCountedPages } from './../../../../../models/vacancy/shortVacanciesWithCountedPages';
import { ShortVacancy } from 'src/app/models/vacancy/shortVacancy';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { FilterStatusVacancy } from 'src/app/models/vacancy/filterStatusVacancy';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { Router } from '@angular/router';
import { FILTER_STATUS_VACANCY_MAPPER, VACANCY_STATUS_TRANSLATE } from '../../../../../common/vacancy.description';
import { DeleteVacancyComponent } from './delete-vacancy/delete-vacancy.component';

@Component({
  selector: 'app-users-vacancies',
  templateUrl: './users-vacancies.component.html',
  styleUrls: ['./users-vacancies.component.css']
})
export class UsersVacanciesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'status', 'createdAt', 'dateEndPublication', 'operations'];
  dataSource: MatTableDataSource<ShortVacancy>;
  shortVacancy: ShortVacancy[];
  vacanciesWithCountedPages: ShortVacanciesWithCountedPages;

  filterStatusVacancyMapper = FILTER_STATUS_VACANCY_MAPPER;
  vacancyStatusTranslate = VACANCY_STATUS_TRANSLATE;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private router: Router,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.shortVacancy = [];
    this.vacanciesWithCountedPages = new ShortVacanciesWithCountedPages();
    this.vacanciesWithCountedPages.filterStatusVacancy = FilterStatusVacancy.ALL;
  }

  ngOnInit() {
    this.loadAllShortVacancies();
  }

  linkToVacancy(id) {
    this.router.navigateByUrl(`${ActiveUrls.FIND_VACANCIES}/${id}`);
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.vacanciesWithCountedPages.search = null : this.vacanciesWithCountedPages.search = filterValue;
    this.vacanciesWithCountedPages.search = filterValue;
    this.defaultSortAndPage();
    this.loadAllShortVacancies();
  }

  sortChange(event) {
    this.vacanciesWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.vacanciesWithCountedPages.sortParams);
    this.vacanciesWithCountedPages.pageableParams = new PageableParams();
    this.loadAllShortVacancies();
  }

  selectFilterStatus(role) {
    this.vacanciesWithCountedPages.pageableParams = new PageableParams();
    this.vacanciesWithCountedPages.sortParams = new SortParams();
    this.loadAllShortVacancies();
  }

  public handlePage(event: any) {
    this.vacanciesWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.vacanciesWithCountedPages.pageableParams);
    this.loadAllShortVacancies();
  }

  loadAllShortVacancies() {
    this.adminService.getAllShortVacancies( this.vacanciesWithCountedPages).subscribe((data: ShortVacanciesWithCountedPages) => {
      if(data != null) {
        this.shortVacancy = data.vacancies;
        this.vacanciesWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
        this.dataSource = new MatTableDataSource(this.shortVacancy);
        this.dataSource.sort = this.sort;
      }
    });
  }

  defaultSortAndPage() {
    this.vacanciesWithCountedPages.pageableParams = new PageableParams();
    this.vacanciesWithCountedPages.sortParams = new SortParams();
  }

  deleteVacancy(vacancy) {
    const dialogRef = this.dialog.open(DeleteVacancyComponent, {
      width: '550px',
      data: vacancy
    });
    dialogRef.afterClosed().subscribe((data: ShortVacancy) => {
      if(data != null) {
        this.adminService.deleteVacancy(data.id, data.message).subscribe(el => {
          this.loadAllShortVacancies();
        });
      }
    });
  }
}
