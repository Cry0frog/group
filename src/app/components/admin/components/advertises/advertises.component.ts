import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { PublicAdvertising } from 'src/app/models/advertising/publicAdvertising';
import { AdminService } from '../../service/admin.service';
import { DeleteAdvertisingComponent } from './delete-advertising/delete-advertising.component';
import { AddAdvertisingComponent } from './add-advertising/add-advertising.component';

@Component({
  selector: 'app-advertises',
  templateUrl: './advertises.component.html',
  styleUrls: ['./advertises.component.css']
})
export class AdvertisesComponent implements OnInit {
  publicAdvertises: PublicAdvertising[];

  displayedColumns: string[] = ['adProvide', 'operations'];
  dataSource: MatTableDataSource<PublicAdvertising>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    public dialog: MatDialog) {
    this.publicAdvertises = [];
   }

  ngOnInit() {
    this.loadAllAdvertises();
  }

  loadAllAdvertises() {
    this.adminService.getAllAdvertises().subscribe((data: PublicAdvertising[]) => {
      this.publicAdvertises = data;

      this.dataSource = new MatTableDataSource(this.publicAdvertises);
      this.dataSource.paginator = this.paginator;
      
    });
  }

  addAdvertising() {
    const dialogRef = this.dialog.open(AddAdvertisingComponent, {
      width: '550px',
      data: {publicAdvertising: new PublicAdvertising(), listAdvertises: this.publicAdvertises}
    });
    dialogRef.afterClosed().subscribe((data: PublicAdvertising) => {
      if(data != null) {
        this.adminService.addAdvertising(data).subscribe(el => {
          this.loadAllAdvertises();
        });
      }
    });
  }

  editAdvertising(advertising: PublicAdvertising) {
    const copyAdvertising: PublicAdvertising = new PublicAdvertising();
    Object.assign(copyAdvertising, advertising);
    const dialogRef = this.dialog.open(AddAdvertisingComponent, {
      width: '550px',
      data: {publicAdvertising: copyAdvertising, listAdvertises: this.publicAdvertises}
    });
    dialogRef.afterClosed().subscribe((data: PublicAdvertising) => {
      if(data != null) {
        this.adminService.editAdvertising(data).subscribe(el => {
          this.loadAllAdvertises();
        });
      }
    });
  }

  deleteAdvertising(id) {
    const dialogRef = this.dialog.open(DeleteAdvertisingComponent, {
      width: '550px',
      data: id
    });
    dialogRef.afterClosed().subscribe((id: number) => {
      if(id != null) {
        this.adminService.deleteAdvertising(id).subscribe(el => {
          this.loadAllAdvertises();
        });
      }
    });
  }

}
