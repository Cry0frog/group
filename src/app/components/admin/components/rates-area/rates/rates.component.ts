import { RATE_TYPE_DISPLAY } from './../../../common/admin.descriptions';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteRateComponent } from './delete-rate/delete-rate.component';
import { AddRateComponent } from './add-rate/add-rate.component';
import { Rate } from './../../../../../models/rates/rate';
import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RatesWithCountedPages } from 'src/app/models/rates/ratesWithCountedPages';
import { SortType } from 'src/app/models/common/sortType';
import { RateService } from '../../../service/rate.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['id', 'startRate', 'type', 'cost',
    'timeWindowStart', 'timeWindowEnd', 'additionalInfo', 'description',
    'operations'];

  dataSource: MatTableDataSource<Rate>;
  ratesWithCountedPages: RatesWithCountedPages;
  rateTypeDisplay = RATE_TYPE_DISPLAY;

  constructor(private rateService: RateService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.ratesWithCountedPages = new RatesWithCountedPages();
    this.reloadRates();
  }

  sortChange(event) {
      this.ratesWithCountedPages.pageIndex = 0;
      this.ratesWithCountedPages.pageSize = 20;
      this.ratesWithCountedPages.nameToSort = event.active;
      if(event.direction == SortType.DECK) {
        this.ratesWithCountedPages.typeToSort = SortType.DECK;
        this.reloadRates();
      }
      else if(event.direction == SortType.ASK) {
        this.ratesWithCountedPages.typeToSort = SortType.ASK;
        this.reloadRates();
      }
  }

  reloadRates() {
    this.rateService.getAllRates(this.ratesWithCountedPages).subscribe((data: RatesWithCountedPages) => {
      this.ratesWithCountedPages = data;

      this.dataSource = new MatTableDataSource(this.ratesWithCountedPages.rates);
      //this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public handlePage(event: any) {
    if(event.pageSize != this.ratesWithCountedPages.pageSize) {
      this.ratesWithCountedPages.pageIndex = 0;
      this.ratesWithCountedPages.pageSize = event.pageSize;
    }
    else {
      this.ratesWithCountedPages.pageIndex = event.pageIndex;
    }
    this.reloadRates();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(filterValue === "") {
      this.ratesWithCountedPages.search = "non";
    }
    else {
      this.ratesWithCountedPages.search = filterValue;
    }

    this.reloadRates();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addOrUpdateRate(rate: Rate) {
    const dialogRef = this.dialog.open(AddRateComponent, {
      width: '700px',
      data: rate == null ? new Rate() : rate
    });
    dialogRef.afterClosed().subscribe((rate: Rate) => {
      if(rate != null) {
        if(rate.timeWindowStart == null || rate.timeWindowEnd == null) {
          rate.timeWindowStart == null;
          rate.timeWindowEnd == null;
        }

        if(rate.id == null) {
          this.rateService.addRate(rate).subscribe(el => {
            this.reloadRates();
          });
        }
        else {
          this.rateService.updateRate(rate).subscribe(el => {
            this.reloadRates();
          });
        }
      }
    });
  }

  deleteRate(rate: Rate) {
    const dialogRef = this.dialog.open(DeleteRateComponent, {
      width: '550px',
      data: rate.id
    });
    dialogRef.afterClosed().subscribe((id: number) => {
      if(id != null) {
        this.rateService.deleteRate(rate.id).subscribe(el => {
          this.reloadRates();
        });
      }
    });
  }

}
