import { DevelopmentPartnersWithCountedPages } from './../../../../../models/development/developmentPartnersWithCountedPages';
import { UpdatePhotoFakeComponent } from './update-photo-fake/update-photo-fake.component';
import { DevelopmentService } from './../../../service/development.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ROLE_TITILE_DISPLAY,  ROLE_DISPLAY} from '../../../common/admin.descriptions';
import { DevelopmentPartner } from 'src/app/models/development/developmentPartner';
import { EditFakeUsersComponent } from './edit-fake-users/edit-fake-users.component';
import { PageableParams } from 'src/app/models/pageable/PageableParams';
import { SortParams } from 'src/app/models/sort/sortParams';
import { BaseLazyLoadingService } from 'src/app/services/base-lazy-loading.service';

@Component({
  selector: 'app-fake-users',
  templateUrl: './fake-users.component.html',
  styleUrls: ['./fake-users.component.css']
})
export class FakeUsersComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'id', 'username', 'fio', 'roles', 'phoneNumber', 'operations'];
  dataSource: MatTableDataSource<DevelopmentPartner>;
  fakePartners: DevelopmentPartner[];
  roleTitleDisplay = ROLE_TITILE_DISPLAY;
  roleDisplay = ROLE_DISPLAY;

  fakePartnersWithCountedPages: DevelopmentPartnersWithCountedPages;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private developmentService: DevelopmentService,
    public dialog: MatDialog,
    private baseLazyLoadingService: BaseLazyLoadingService
  ) {
    this.fakePartnersWithCountedPages = new DevelopmentPartnersWithCountedPages();
    this.fakePartners = [];
  }

  ngOnInit() {
    this.loadAllFakePartners();
  }

  selectFilterRole(role) {
    this.fakePartnersWithCountedPages.pageableParams = new PageableParams();
    this.fakePartnersWithCountedPages.sortParams = new SortParams();
    this.loadAllFakePartners();
  }

  sortChange(event) {
    this.fakePartnersWithCountedPages.sortParams = this.baseLazyLoadingService.sortChange(event, this.fakePartnersWithCountedPages.sortParams);
    this.fakePartnersWithCountedPages.pageableParams = new PageableParams();
    this.loadAllFakePartners();
  }

  public handlePage(event: any) {
    this.fakePartnersWithCountedPages.pageableParams = this.baseLazyLoadingService.handlePage(event, this.fakePartnersWithCountedPages.pageableParams);
    this.loadAllFakePartners();
  }

  loadAllFakePartners() {
    this.developmentService.getAllDevelopmentPartnersWithCountedPages(this.fakePartnersWithCountedPages).subscribe((data: DevelopmentPartnersWithCountedPages) => {
      if(data != null) {
        this.fakePartners = data.partners;
        this.fakePartnersWithCountedPages.pageableParams.countedPages = data.pageableParams.countedPages;
        this.dataSource = new MatTableDataSource(this.fakePartners);
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue === "" ? this.fakePartnersWithCountedPages.search = null : this.fakePartnersWithCountedPages.search = filterValue;
    this.fakePartnersWithCountedPages.search = filterValue;
    this.fakePartnersWithCountedPages.pageableParams = new PageableParams();
    this.fakePartnersWithCountedPages.sortParams = new SortParams();
    this.loadAllFakePartners();
  }

  addFakePartner() {
    const dialogRef = this.dialog.open(EditFakeUsersComponent, {
      width: '800px',
      disableClose: true,
      data: new DevelopmentPartner()
    });
    dialogRef.afterClosed().subscribe((fakePartner: DevelopmentPartner) => {
      if(fakePartner != null) {
        this.developmentService.addDevelopmentPartner(fakePartner).subscribe(el => {
          this.loadAllFakePartners();
        });
      }
    });
  }

  editFakePartner(fakePartner) {
    const copy = new DevelopmentPartner();
    Object.assign(copy, fakePartner);
    const dialogRef = this.dialog.open(EditFakeUsersComponent, {
      width: '800px',
      disableClose: true,
      data: copy

    });
    dialogRef.afterClosed().subscribe((data: DevelopmentPartner) => {
      if(data != null) {
        this.developmentService.updateDevelopmentPartner(data).subscribe(el => {
          this.loadAllFakePartners();
        });
      }
    });
  }

  changeFakePhoto(fakePartner) {
    this.dialog.open(UpdatePhotoFakeComponent, {
      width: "800px",
      data: fakePartner
    });
  }
}
