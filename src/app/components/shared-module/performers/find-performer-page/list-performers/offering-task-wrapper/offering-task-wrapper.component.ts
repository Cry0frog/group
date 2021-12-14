import { PartnerInfoWithCity } from './../../../../../../models/partnerInfo/partnerInfoWithCity';
import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ShortTask } from './../../../../../../models/task/shortTask';
import { TaskComponentMode } from './../../../../tasks/task/taskComponentMode';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'angular-web-storage';
import { AuthService } from 'src/app/auth/auth.service';
import { PageableParams } from 'src/app/models/pageable/PageableParams';

@Component({
  selector: 'app-offering-task-wrapper',
  templateUrl: './offering-task-wrapper.component.html',
  styleUrls: ['./offering-task-wrapper.component.css']
})
export class OfferingTaskWrapperComponent implements OnInit {
  isLoaded: boolean;
  taskInfos: ShortTask[];

  pageable: PageableParams;
  isLoadAll: boolean;
  isCreateTask: boolean;

  constructor(public dialogRef: MatDialogRef<OfferingTaskWrapperComponent>,
    private sessionStorage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: PartnerInfoWithCity,
    private partnerService: PartnerService,
    private authService: AuthService,
    public router: Router) { }

  ngOnInit() {
    this.isLoadAll = false;
    this.pageable = new PageableParams();
    this.isLoaded = true;
    this.taskInfos = [];
    this.getFilteredShortTasks();
  }

  get isMobileMode() {
    return this.authService.isMobileMode();
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = !this.isMobileMode ? document.documentElement.scrollHeight - 1 : document.documentElement.scrollHeight - 60;
    if(pos >= max && !this.isLoadAll && this.pageable.size<=this.taskInfos.length) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    this.pageable.page++;
    this.partnerService.getYourAvailableShortInfoTasks(this.pageable, this.data.idPartner).subscribe((data: ShortTask[]) => {
      data.forEach(el => {
        this.taskInfos.push(el);
      })
    });
  }

  getFilteredShortTasks() {
    this.partnerService.getYourAvailableShortInfoTasks(this.pageable, this.data.idPartner).subscribe((data: ShortTask[]) => {
      if(data.length == 0) {
        this.isCreateTask = true;
        this.isLoadAll = true;
      }
      else {
        this.taskInfos = ShortTask.sortByDateDesc(data);
      }
    });
  }

  linkToNewTask(): void {
    this.sessionStorage.set('save_performer', this.data);
    this.sessionStorage.set('save_partner_current_id', this.authService.getCurrentId);
    this.sessionStorage.set('save_performer_category', this.data.categoriesName);
    this.dialogRef.close();

    window.open(this.router.serializeUrl(this.router.createUrlTree([`/new_task`])));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTaskMode() {
    return TaskComponentMode.COMMON_OFFERING;
  }

  handleChooseTask(shortTask: ShortTask) {
    this.partnerService.offerTaskToPerformer(shortTask.id, this.data.idPartner).subscribe(_ => {
      this.dialogRef.close(shortTask);
    });
  }

}
