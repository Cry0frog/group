import { PartnerService } from 'src/app/components/partner/service/partner.service';
import { ActivatedRoute } from '@angular/router';
import { PartnerInfoWithCity } from './../../../../../models/partnerInfo/partnerInfoWithCity';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/models/task/task';

@Component({
  selector: 'app-list-performers',
  templateUrl: './list-performers.component.html',
  styleUrls: ['./list-performers.component.css']
})
export class ListPerformersComponent implements OnInit {
  @Input() shortPerformers: PartnerInfoWithCity[];
  @Output() eventChooseCategoryByTaskCategory = new EventEmitter<Task>();

  choosenTask: Task;

  constructor(private activeRoute: ActivatedRoute,
    private partnerService: PartnerService,
  ) {}

  ngOnInit() {
    if(this.activeRoute.snapshot.params['taskId'] != null) {
      const taskId = parseInt(this.activeRoute.snapshot.params['taskId']);
      this.partnerService.getMyTaskInfo(taskId).subscribe((task: Task) => {
        this.choosenTask = task;
        setTimeout(() => {
          this.eventChooseCategoryByTaskCategory.emit(task);
        }, 400);
      });
    }
  }

  addLoadedMoreShortPerformers(loadedMore: PartnerInfoWithCity[]) {
    this.shortPerformers = this.shortPerformers.concat(loadedMore);
  }
}
