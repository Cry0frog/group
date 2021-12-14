import { AddCommissionComponent } from './add-commission/add-commission.component';
import { DeleteCommissionComponent } from './delete-commission/delete-commission.component';
import { Commission } from './../../../../models/payment/commission';
import { AdminCommissionService } from './../../service/admin-commission.service';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'startCommission',
    'commission', 'bottomSummBorder', 'operations'];
  dataSource: MatTableDataSource<Commission>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(private commissionService: AdminCommissionService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadCommissions();
  }

  loadCommissions() {
    this.commissionService.getAllCommission().subscribe((data: Commission[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addCommission() {
    const dialogRef = this.dialog.open(AddCommissionComponent, {
      width: '550px',
      data: new Commission()
    });
    dialogRef.afterClosed().subscribe((data: Commission) => {
      if(data != null) {
        this.commissionService.addCommission(data).subscribe(_ => {
          this.loadCommissions();
        });
      }
    });
  }

  updateCommission(commission: Commission) {
    const dialogRef = this.dialog.open(AddCommissionComponent, {
      width: '550px',
      data: commission
    });
    dialogRef.afterClosed().subscribe((data: Commission) => {
      if(data != null) {
        this.commissionService.updateCommission(data).subscribe(_ => {
          this.loadCommissions();
        });
      }
    });
  }

  deleteCommission(commission: Commission) {
    const dialogRef = this.dialog.open(DeleteCommissionComponent, {
      width: '550px',
      data: commission
    });
    dialogRef.afterClosed().subscribe((data: Commission) => {
      if(data != null) {
        this.commissionService.deleteCommission(data).subscribe(_ => {
          this.loadCommissions();
        });
      }
    });
  }

}
