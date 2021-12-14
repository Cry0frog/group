import { Category } from 'src/app/models/category/category';
import { CategoryTree } from '../../../../../models/category/categoryTree';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { PreviewWrapperComponent } from './preview-wrapper/preview-wrapper.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AdminService } from '../../../service/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { ImageCategoryComponent } from './image-category/image-category.component';
import { TransferCategoryComponent } from './transfer-category/transfer-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryTree[];
  displayedColumns: string[] = ['name', 'operations'];
  dataSource: MatTableDataSource<CategoryTree>;
  lastShowedId: number;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadAllCategories();
  }

  loadAllCategories() {
    this.adminService.getAllCategoriesWithProperties().subscribe((data: CategoryTree[]) => {
      this.lastShowedId = null;
      this.makeSortAndRefresh(data);
    });
  }

  makeSortAndRefresh(data) {
    this.categories = CategoryTree.getCategoriesInRows(data);
    if(this.lastShowedId != null) {
      const filtered = this.categories.filter(el => el.root != null && el.root.id == this.lastShowedId);
      filtered.forEach(el => {
        el.isShow = true;
      });
    }
    this.refreshCategoriesDisplay();
  }

  refreshCategoriesDisplay() {
    this.dataSource = new MatTableDataSource(this.categories.filter((category: CategoryTree) => category.isShow));

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  previewTaskCreation(category: CategoryTree) {
    const dialogRef = this.dialog.open(PreviewWrapperComponent, {
      width: '850px',
      data: {
        root: category.root == null ? category: category.root,
        child: category.root == null ? null: category
      }
    });
  }

  onRootDirectoryClick(row: CategoryTree) {
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
      row.children.forEach((child: CategoryTree) => child.isShow = isShow);
    }
    row.isExpanded = !row.isExpanded;
    this.refreshCategoriesDisplay();
  }

  addFolder() {
    const category: CategoryTree = <CategoryTree>CategoryTree.createDefaultEmptyFolder();
    const filtered = this.categories.filter(el => el.root != null);
    category.order = this.findMaxCategoryOrder(filtered) + 1;

    this.addCommonCategory(category);
  }

  addCategory(root: CategoryTree) {
    if(root != null && !root.folder) {
      return;
    }
    const categoryTree: CategoryTree = <CategoryTree>CategoryTree.createDefaultEmptyCategory();
    categoryTree.root = root;
    if(root != null) {
      categoryTree.order = this.findMaxCategoryOrder(root.children) + 1;
    }
    else {
      const filtered = this.categories.filter(el => el.root != null);
      categoryTree.order = this.findMaxCategoryOrder(filtered) + 1;
    }

    this.addCommonCategory(categoryTree);
  }

  findMaxCategoryOrder(categories: Category[]): number {
    if(categories == null || categories.length == 0) {
      return 0;
    }
    const max = categories.reduce((prev, current) => {
      return (prev.order > current.order) ? prev : current
    });

    return max.order;
  }

  addCommonCategory(category: CategoryTree) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '550px',
      data: category
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.adminService.addCategory(category).subscribe(el => {
          this.loadAllCategories();
        });
      }
    });
  }

  addCategoryBasedOnCurrent(base: CategoryTree) {
    const root = this.categories.filter(el => el.id == base.root.id)[0];
    const categoryTree = CategoryTree.createCategoryBasedOnEtalon(base);
    categoryTree.order = this.findMaxCategoryOrder(root.children) + 1;
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '550px',
      data: categoryTree
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.adminService.addCategory(category).subscribe(el => {
          this.loadAllCategories();
        });
      }
    });

  }

  deleteCategory(category: CategoryTree) {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '550px',
      data: category
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.adminService.deleteCategory(category).subscribe(el => {
          this.loadAllCategories();
        });
      }
    });
  }

  updateCategory(category: CategoryTree) {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '550px',
      data: category
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.adminService.updateCategory(category).subscribe(el => {
          this.loadAllCategories();
        });
      }
    });
  }

  moveToTop(category: CategoryTree) {
    let categories: Category[] = this.categories;
    let isRoot = true;
    if(category.root != null) {
      categories = this.categories.filter(el => {
        return el.id == category.root.id;
      })[0].children;
      isRoot = false;
    }

    const prev = this.findPrev(category.order, categories, isRoot);
    this.move(category, prev);
  }

  private findPrev(order: number, categories: Category[], isRoot: boolean): Category {
    if(isRoot) {
      categories = categories.filter(el => el.root == null);
    }
    const mores = categories.filter(el => el.order < order);
    if(mores.length == 0) {
      return null;
    }

    return mores.reduce((prev: Category, cur: Category) => {
      return prev.order > cur.order ? prev: cur;
    })
  }

  moveToDown(category: CategoryTree) {
    let categories: Category[] = this.categories;
    let isRoot = true;
    if(category.root != null) {
      categories = this.categories.filter(el => {
        return el.id == category.root.id;
      })[0].children;
      isRoot = false;
    }

    const next = this.findNext(category.order, categories, isRoot);
    this.move(category, next);
  }

  private findNext(order: number, categories: Category[], isRoot: boolean): Category {
    if(isRoot) {
      categories = categories.filter(el => el.root == null);
    }
    const mores = categories.filter(el => el.order > order);
    if(mores.length == 0) {
      return null;
    }

    return mores.reduce((prev: Category, cur: Category) => {
      return prev.order < cur.order ? prev: cur;
    })
  }

  move(category: CategoryTree, next: Category) {
    if(next != null) {
      let curOrder = category.order;
      category.isExpanded = false;
      category.order = next.order;
      next.order = curOrder;

      this.categories = this.categories.filter(el => {
        return el.root == null;
      });
      this.adminService.moveCategory(category.id, category.order, next.id, next.order)
        .subscribe(_ => {});
      this.makeSortAndRefresh(this.categories);
    }
  }

  updatePhoto(category: CategoryTree) {
    const dialogRef = this.dialog.open(ImageCategoryComponent, {
      width: '550px',
      data: category
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.loadAllCategories();
      }
    });
  }

  transferCategory(category: CategoryTree) {
    const dialogRef = this.dialog.open(TransferCategoryComponent, {
      width: '550px',
      data: category
    });
    dialogRef.afterClosed().subscribe((category: CategoryTree) => {
      if(category != null) {
        this.adminService.transferCategory(category).subscribe(el => {
          this.loadAllCategories();
        });
      }
    });
  }

}
