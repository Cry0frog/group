import { UpdatePhotoPromotionComponent } from './update-photo-promotion/update-photo-promotion.component';
import { DeletePromotionComponent } from './delete-promotion/delete-promotion.component';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AdminService } from 'src/app/components/admin/service/admin.service';
import { EditPromotionComponent } from './edit-promotion/edit-promotion.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ShortPromotion } from 'src/app/models/promotion/shortPromotion';

@Component({
  selector: 'app-admin-promotion',
  templateUrl: './admin-promotion.component.html',
  styleUrls: ['./admin-promotion.component.css']
})
export class AdminPromotionComponent implements OnInit {
  shortAdminPromotions: ShortPromotion[];
  displayedColumns: string[] = ['name', 'status', 'operations'];
  dataSource: MatTableDataSource<ShortPromotion>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    public dialog: MatDialog) {
    this.shortAdminPromotions = [];
  }

  ngOnInit() {
    this.getAllPromotions();
  }

  getAllPromotions() {
    this.adminService.getAllShortPromotions().subscribe((data: ShortPromotion[]) => {
      if(data != null) {
        this.shortAdminPromotions = data;

        this.dataSource = new MatTableDataSource(this.shortAdminPromotions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  addPromotion() {
    const dialogRef = this.dialog.open(EditPromotionComponent, {
      width: '2000px',
      data: new ShortPromotion()
    });
    dialogRef.afterClosed().subscribe((shortAdminPromotion: ShortPromotion) => {
      if(shortAdminPromotion != null) {
        this.adminService.createShortPromotion(shortAdminPromotion).subscribe(el => {
          this.getAllPromotions();
        });
      }
    });
  }

  updatePromotion(promo) {
    const copyPromo = new ShortPromotion();
    Object.assign(copyPromo, promo);
    const dialogRef = this.dialog.open(EditPromotionComponent, {
      width: '2000px',
      data: copyPromo
    });
    dialogRef.afterClosed().subscribe((shortAdminPromotion: ShortPromotion) => {
      if(shortAdminPromotion != null) {
        this.adminService.updateShortPromotion(shortAdminPromotion).subscribe(el => {
          this.getAllPromotions();
        });
      }
    });
  }

  deletePromotion(promo) {
    const dialogRef = this.dialog.open(DeletePromotionComponent, {
      width: '550px',
      data: promo
    });
    dialogRef.afterClosed().subscribe((shortAdminPromotion: ShortPromotion) => {
      if(shortAdminPromotion != null) {
        this.adminService.deleteShortPromotion(shortAdminPromotion.id).subscribe(el => {
          this.getAllPromotions();
        });
      }
    });
  }

  updatePhotoPromotion(promo) {
    const dialogRef = this.dialog.open(UpdatePhotoPromotionComponent, {
      width: '550px',
      data: promo
    });
    dialogRef.afterClosed().subscribe((shortAdminPromotion: ShortPromotion) => {
      if(shortAdminPromotion != null) {
        this.getAllPromotions();
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
