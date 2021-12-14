import { AdminService } from 'src/app/components/admin/service/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSort, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';
import { ShortResume } from 'src/app/models/resume/shortResume';
import { ShortResumeWithCountedPages } from 'src/app/models/resume/shortResumeWithCountedPages';
import { DeleteResumeComponent } from './delete-resume/delete-resume.component';
import { FILTER_STATUS_RESUME_MAPPER } from '../../../../../common/resume.description';
import { FilterStatusResume } from 'src/app/models/resume/filterStatusResume';

@Component({
  selector: 'app-users-resume',
  templateUrl: './users-resume.component.html',
  styleUrls: ['./users-resume.component.css']
})
export class UsersResumeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'creatorName', 'vacancyId', 'dateOfCreation', 'dateOfLastChange', 'operations'];
  dataSource: MatTableDataSource<ShortResume>;
  shortResumeList: ShortResume[];
  resumeWithCountedPages: ShortResumeWithCountedPages;

  filterStatusResumeMapper = FILTER_STATUS_RESUME_MAPPER;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    private router: Router,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.shortResumeList = [];
    this.resumeWithCountedPages = new ShortResumeWithCountedPages();
  }

  ngOnInit() {
    this.resumeWithCountedPages.filterStatusResume = FilterStatusResume.ALL;
    this.loadAllShortResume();
  }

  linkToProfile(id) {
    window.open(this.router.serializeUrl(this.router.createUrlTree([`user/${id}`])), '_blank');
  }

  linkToResume(id) {
    window.open(this.router.serializeUrl(this.router.createUrlTree([`job/find_vacancy/${id}`])), '_blank');
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.resumeWithCountedPages.search = null : this.resumeWithCountedPages.search = filterValue;
    this.resumeWithCountedPages.search = filterValue;
    this.defaultSortAndPage();
    this.loadAllShortResume();
  }

  sortChange(event) {
    this.resumeWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.resumeWithCountedPages.sortParams);
    this.resumeWithCountedPages.pageableParams = new PageableParams();
    this.loadAllShortResume();
  }

  selectFilterStatus(role) {
    this.resumeWithCountedPages.pageableParams = new PageableParams();
    this.resumeWithCountedPages.sortParams = new SortParams();
    this.loadAllShortResume();
  }

  public handlePage(event: any) {
    this.resumeWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.resumeWithCountedPages.pageableParams);
    this.loadAllShortResume();
  }

  loadAllShortResume() {
    this.adminService.getAllShortResume(this.resumeWithCountedPages).subscribe((data: ShortResumeWithCountedPages) => {
      if(data != null) {
        this.shortResumeList = data.resumeList;
        this.resumeWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
        this.dataSource = new MatTableDataSource(this.shortResumeList);
        this.dataSource.sort = this.sort;
      }
    });
  }

  defaultSortAndPage() {
    this.resumeWithCountedPages.pageableParams = new PageableParams();
    this.resumeWithCountedPages.sortParams = new SortParams();
  }

  deleteResume(resume) {
    const dialogRef = this.dialog.open(DeleteResumeComponent, {
      width: '550px',
      data: resume
    });
    dialogRef.afterClosed().subscribe((data: ShortResume) => {
      if(data != null) {
        this.adminService.deleteResume(data.id, data.message).subscribe(el => {
          this.loadAllShortResume();
        });
      }
    });
  }
}
