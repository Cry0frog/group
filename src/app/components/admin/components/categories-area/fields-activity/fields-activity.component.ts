import { DeleteAdvertisingComponent } from './../../advertises/delete-advertising/delete-advertising.component';
import { AdminService } from './../../../service/admin.service';
import { FieldActivity } from './../../../../../models/field-activity/fileldActivity';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { AddFieldCategoryComponent } from './add-field-category/add-field-category.component';
import { ImageFieldActivityComponent } from './image-field-activity/image-field-activity.component';

@Component({
  selector: 'app-fields-activity',
  templateUrl: './fields-activity.component.html',
  styleUrls: ['./fields-activity.component.css']
})
export class FieldsActivityComponent implements OnInit {

  fieldsActivity: FieldActivity[];
  displayedColumns: string[] = ['name', 'operations'];
  dataSource: MatTableDataSource<FieldActivity>;
  lastShowedId: number;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadAllFieldsActivity();
  }

  loadAllFieldsActivity() {
    this.adminService.getAllFieldsActivity().subscribe((data: FieldActivity[]) => {
      this.lastShowedId = null;
      this.makeSortAndRefresh(data);
    });
  }

  makeSortAndRefresh(data) {
    this.fieldsActivity = FieldActivity.getFieldsAcivityInRows(data);
    console.log(this.fieldsActivity);
    if(this.lastShowedId != null) {
      const filtered = this.fieldsActivity.filter(el => el.root != null && el.root.id == this.lastShowedId);
      filtered.forEach(el => {
        el.isShow = true;
      });
    }
    this.refreshCategoriesDisplay();
  }

  refreshCategoriesDisplay() {
    this.dataSource = new MatTableDataSource(this.fieldsActivity.filter((fieldActivity: FieldActivity) => fieldActivity.isShow));

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRootDirectoryClick(row: FieldActivity) {
    let isShow: boolean;
    if(row.isExpanded == true) {
      this.lastShowedId = null;
      isShow = false;
    }
    else {
      this.lastShowedId = row.id;
      isShow = true;
    }
    if(row.children != null) {
      row.children.forEach((child: FieldActivity) => child.isShow = isShow);
    }
    row.isExpanded = !row.isExpanded;
    this.refreshCategoriesDisplay();
  }

  addFolder() {
    const fieldActivity = new FieldActivity();
    fieldActivity.folder = true;
    this.addCommonFieldActivity(fieldActivity)
  }

  addFieldActivityForFolder(root) {
    const fieldActivity = new FieldActivity();
    fieldActivity.root = root;
    this.addCommonFieldActivity(fieldActivity)
  }

  addFieldActivity() {
    const fieldActivity = new FieldActivity();
    this.addCommonFieldActivity(fieldActivity)
  }

  addCommonFieldActivity(fieldActivity: FieldActivity) {
    const dialogRef = this.dialog.open(AddFieldCategoryComponent, {
      width: '600px',
      data: fieldActivity
    });
    dialogRef.afterClosed().subscribe((fieldActivity: FieldActivity) => {
      if(fieldActivity != null) {
        this.adminService.addFieldActivity(fieldActivity).subscribe(el => {
          this.loadAllFieldsActivity();
        });
      }
    });
  }

  deleteFieldActivity(id) {
    const dialogRef = this.dialog.open(DeleteAdvertisingComponent, {
      width: '600px',
      data: id
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data != null) {
        this.adminService.deleteFieldActivity(data).subscribe(el => {
          this.loadAllFieldsActivity();
        });
      }
    });
  }

  updateFieldActivity(fieldActivity: FieldActivity) {
    const copyFieldActivity = new FieldActivity();
    Object.assign(copyFieldActivity, fieldActivity)

    const dialogRef = this.dialog.open(AddFieldCategoryComponent, {
      width: '600px',
      data: copyFieldActivity
    });
    dialogRef.afterClosed().subscribe((fieldActivity: FieldActivity) => {
      if(fieldActivity != null) {

        this.adminService.updateFieldActivity(fieldActivity).subscribe(el => {
          this.loadAllFieldsActivity();
        });
      }
    });
  }

  updatePhoto(fieldActivity: FieldActivity) {
    const dialogRef = this.dialog.open(ImageFieldActivityComponent, {
      width: '550px',
      data: fieldActivity
    });
    dialogRef.afterClosed().subscribe((data: FieldActivity) => {
      if(data != null) {
        this.loadAllFieldsActivity();
      }
    });
  }
}
