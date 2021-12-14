import { ShortNews } from './../../../../models/news/shortNews';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AdminService } from '../../service/admin.service';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { DeleteNewsComponent } from './delete-news/delete-news.component';
import { UpdatePhotoNewsComponent } from './update-photo-news/update-photo-news.component';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css']
})
export class AdminNewsComponent implements OnInit {

  shortNews: ShortNews[];
  displayedColumns: string[] = ['name', 'status', 'operations'];
  dataSource: MatTableDataSource<ShortNews>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private adminService: AdminService,
    public dialog: MatDialog) {
    this.shortNews = [];
  }

  ngOnInit() {
    this.getAllNews();
  }

  getAllNews() {
    this.adminService.getAllNews().subscribe((data: ShortNews[]) => {
      if(data != null) {
        this.shortNews = data;

        this.dataSource = new MatTableDataSource(this.shortNews);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  addNews() {
    const dialogRef = this.dialog.open(EditNewsComponent, {
      width: '2000px',
      data: new ShortNews()
    });
    dialogRef.afterClosed().subscribe((news: ShortNews) => {
      if(news != null) {
        this.adminService.addNews(news).subscribe(el => {
          this.getAllNews();
        });
      }
    });
  }

  updateNews(news) {
    const copyNews = new ShortNews();
    Object.assign(copyNews, news);
    const dialogRef = this.dialog.open(EditNewsComponent, {
      width: '2000px',
      data: copyNews
    });
    dialogRef.afterClosed().subscribe((news: ShortNews) => {
      if(news != null) {
        this.adminService.editNews(news).subscribe(el => {
          this.getAllNews();
        });
      }
    });
  }

  deleteNews(news) {
    const dialogRef = this.dialog.open(DeleteNewsComponent, {
      width: '550px',
      data: news
    });
    dialogRef.afterClosed().subscribe((news: ShortNews) => {
      if(news != null) {
        this.adminService.deleteNews(news.id).subscribe(el => {
          this.getAllNews();
        });
      }
    });
  }

  updatePhotoNews(news) {
    const dialogRef = this.dialog.open(UpdatePhotoNewsComponent, {
      width: '550px',
      data: news
    });
    dialogRef.afterClosed().subscribe((news: ShortNews) => {
      if(news != null) {
        this.getAllNews();
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
