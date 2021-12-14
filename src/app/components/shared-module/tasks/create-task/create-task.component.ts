import { CreateTaskContentComponent } from './../create-task-content/create-task-content.component';
import { CommonService } from '../../../../common/services/common.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Category } from 'src/app/models/category/category';
import { SessionStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PartnerInfoWithCity } from 'src/app/models/partnerInfo/partnerInfoWithCity';
import { ActiveUrls } from 'src/app/auth/activeUrls';
import { PlaceAdvertising } from 'src/app/models/advertising/common/placeAdvertising';
import { DisplayAdvertisingComponent } from '../../display-advertising/display-advertising.component';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit, OnDestroy {
  @ViewChild(CreateTaskContentComponent, {static: false}) createTaskContent: CreateTaskContentComponent;
  @ViewChild(DisplayAdvertisingComponent, {static: false}) displayAdvertising: DisplayAdvertisingComponent;

  categories: Category[];
  isTaskByPerformer: boolean;
  performer: PartnerInfoWithCity;
  currentUrl: string;

  place: PlaceAdvertising;

  //url: string = "https://bloggood.ru/wp-content/themes/bloggood/img/5tezis-blok.jpg";

  constructor(private commonService: CommonService,
    private sessionStorage: SessionStorageService,
    private aurhService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    this.categories = [];
    this.isTaskByPerformer = false;
    this.place = PlaceAdvertising.CREATE_TASK;
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    const savePartnerId = this.sessionStorage.get('save_partner_current_id');
    const savePerformer: PartnerInfoWithCity = PartnerInfoWithCity.convertToObj(this.sessionStorage.get('save_performer'));
    const savePerformerCategory: string[] = this.sessionStorage.get('save_performer_category');
    this.getAllCategories();

    if(savePerformer != null && savePartnerId != null && this.aurhService.getCurrentId != null) {
      if(this.aurhService.getCurrentId == savePartnerId) {
        this.performer = savePerformer;
        this.isTaskByPerformer = true;

        if(savePerformerCategory != null && savePerformerCategory.length != 0) {
          this.filterCategoriesByPerformerCategoriesName(savePerformerCategory, 5);
        }
      }
    }
  }

  filterCategoriesByPerformerCategoriesName(savePerformerCategory, i) {
    if(this.categories.length != 0) {
      const roots = [];
      this.categories.forEach(rootCategory => {
        const children = rootCategory.children.filter(a => savePerformerCategory.find(b => a.name === b));
        if(children.length != 0) {
          rootCategory.children = children;
          roots.push(rootCategory);
        }
      });
      this.categories = roots;
      return;
    }
    else {
      if(i != 0) {
        setTimeout(() => {
          this.filterCategoriesByPerformerCategoriesName(savePerformerCategory, --i);
        }, 200);
      }
    }
  }

  chooseCategoryHandler(categoryId: number) {
    this.displayAdvertising.chooseCategoryHandler(categoryId);
  }

  navigatePerformers() {
    this.aurhService.navigatePerformers();
  }

  getAllCategories() {
    this.commonService.getAllCategories().subscribe((data: Category[]) => {
      this.categories = data;
      this.createTaskContent.tryApplyingTaskFromStorage(this.categories);
      const params = this.activeRoute.snapshot.queryParams.name;
      if(params) {
        const cat = this.categories.filter(cat => cat.name == params)[0];
        if(cat) {
          this.createTaskContent.selParentCategoryId = cat.id.toString();
          this.tryOnChangeParentCategory(5);
        }
      }
    });
  }

  tryOnChangeParentCategory(i) {
    if(this.createTaskContent.categories.length != 0) {
      this.createTaskContent.onChangeParentCategory();
    }
    else {
      setTimeout(() => this.tryOnChangeParentCategory(--i), 200);
    }
  }

  cancleCreateTaskForPerformer() {
    this.sessionStorage.remove('save_performer');
    this.sessionStorage.remove('save_partner_current_id');
    this.sessionStorage.remove('save_performer_category');
    this.isTaskByPerformer = false;

  }

  ngOnDestroy() {
    if(!this.router.url.match(ActiveUrls.PARTNER_MY_TASKS) && this.sessionStorage.get('save_performer') != null) {
      this.sessionStorage.remove('save_performer');
      this.sessionStorage.remove('save_partner_current_id');
      this.sessionStorage.remove('save_performer_category');

    }
  }
}
