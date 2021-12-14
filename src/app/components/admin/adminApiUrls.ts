
export class AdminApiUrls {
  public static get CATEGORIES(): string { return '/api/admin/category/'; }
  public static get COMMISSION(): string { return '/api/admin/commission/'; }
  public static get SHORT_CATEGORIES(): string { return '/api/admin/category/short'; }
  public static get CATEGORY_IMG(): string { return '/api/admin/category/photo/'; }
  public static get CATEGORY_TRANSFER(): string { return '/api/admin/category/transfer'; }
  public static get CATEGORY_MOVE(): string { return '/api/admin/category/move'; }
  public static get CATEGORY_FOLDER(): string { return '/api/admin/category/folder'; }

  public static get USED_CITIES(): string { return '/api/admin/category/cities'; }

  public static get USERS(): string {return '/api/admin/users/';}
  public static get BLOCKED_USERS(): string {return '/api/admin/users/blocked_users';}
  public static get ALL_USERS(): string {return '/api/admin/users/all';}

  public static get BONUSES_USERS(): string {return '/api/admin/users/bonuses';}
  public static get MESSAGE_USERS(): string {return '/api/admin/users/messages';}

  public static get RATES(): string {return '/api/admin/rate/';}
  public static get RATEJOBS(): string {return '/api/admin/rate/job';}
  public static get REGIONAL_COEFFICIENTS(): string {return '/api/admin/rate/regional/';}
  public static get REGIONAL_HOUR_COEFFICIENTS(): string {return '/api/admin/rate/regional_hour/';}
  public static get REGIONAL_HOUR_DEFAULT_COEFFICIENT(): string {return '/api/admin/rate/regional_hour/default/';}

  public static get DEV_PARTNER(): string {return '/api/admin/development/partner';}
  public static get DEV_PARTNER_BY_PAGES(): string {return '/api/admin/development/partner/pages';}
  public static get PHOTO_DEV_PARTNER(): string {return '/api/admin/development/partner/photo';}
  public static get DEV_TASK(): string {return '/api/admin/development/task';}
  public static get DEV_TASK_BASE(): string {return '/api/admin/development/task/base';}

  public static get RATES_CHECK_PAY_CALC(): string {return '/api/admin/rate/check_pay_calc/';}

  public static get STATUS(): string {return '/api/admin/users/enabled';}
  public static get BLOCK_USERS(): string {return '/api/admin/users/block';}

  public static get SHORT_LEGAL_ENTITY(): string { return '/api/admin/legal_entity'; }
  public static get ENABLE(): string { return '/api/admin/legal_entity/enable'; }
  public static get LEGAL_ENTITY_STATUS(): string { return '/api/admin/legal_entity/status'; }
  public static get BLOCK_LEGAL_ENTITY(): string { return '/api/admin/legal_entity/block'; }
  public static get DOWNLOAD_FILE_LEGAL_ENTITY_INFO(): string { return '/api/admin/legal_entity/download'; }
  public static get ALL_LEGAL_ENTITIES(): string {return '/api/admin/legal_entity/all';}

  public static get ADMIN_SETTING(): string { return '/api/setting/admin' }

  public static get CHATS_TASK(): string {return '/api/admin/chat/chat/task';}
  public static get CHATS_VACANCY(): string {return '/api/admin/chat/chat/vacancy';}
  public static get MY_CHATS(): string {return '/api/admin/chat/chat/my';}
  public static get ALL_MY_CHATS(): string {return '/api/admin/chat/chat/my/all';}
  public static get CHAT(): string { return '/api/admin/chat/chat/'; }
  public static get ALL_ARBITRATIONS(): string {return '/api/admin/chat/arbitration/all';}
  public static get MY_ARBITRATIONS(): string {return '/api/admin/chat/arbitration/my';}
  public static get ALL_MY_ARBITRATIONS(): string {return '/api/admin/chat/arbitration/my/all';}
  public static get ARBITRATIONS_JOIN_ADMIN(): string {return '/api/admin/chat/arbitration/request_admin_help/';}
  public static get ARBITRATION(): string {return '/api/admin/chat/arbitration/';}
  public static get RESOLVE_ARBITRATION(): string {return '/api/admin/chat/arbitration/resolve/';}

  public static get CHAT_COMMON(): string { return '/api/partner/chat/common/'; }

  public static get STATISTICS_ACTIVITY_USERS(): string { return '/api/admin/statistics/users'; }
  public static get STATISTICS_COUNT_ALL_ORDERS(): string { return '/api/admin/statistics/orders'; }
  public static get STATISTICS_AVERAGE_CHECK(): string { return '/api/admin/statistics/average_check'; }
  public static get STATISTICS_SALES_SUCCESS(): string { return '/api/admin/statistics/sales_success'; }
  public static get STATISTICS_REVENUE(): string { return '/api/admin/statistics/revenue'; }
  public static get STATISTICS_PAYOUT(): string { return '/api/admin/statistics/payout'; }
  public static get STATISTICS_COUNT_REG(): string { return '/api/admin/statistics/reg'; }
  public static get STATISTICS_COUNT_REG_PERFORMERS(): string { return '/api/admin/statistics/reg/performers'; }
  public static get STATISTICS_SURVEY_RESULT(): string { return '/api/admin/statistics/survey'; }
  public static get STATISTICS_REGION_USERS(): string { return '/api/admin/statistics/region_users'; }
  public static get STATISTICS_NEW_VACANCIES(): string { return '/api/admin/statistics/new_vacancies'; }
  public static get STATISTICS_NEW_DEF_RESUME(): string { return '/api/admin/statistics/new_def_resume'; }
  public static get STATISTICS_SUBMITTED_RESUME(): string { return '/api/admin/statistics/submitted_resume'; }

  public static get STATISTICS_REPORT_COUNT_ORDERS(): string { return '/api/admin/statistics/report/count_orders'; }
  public static get STATISTICS_REPORT_AVERAGE_CHECK(): string { return '/api/admin/statistics/report/average_check'; }
  public static get STATISTICS_REPORT_NUMBER_OF_SALES(): string { return '/api/admin/statistics/report/number_of_sales'; }
  public static get STATISTICS_REPORT_REVENUE(): string { return '/api/admin/statistics/report/revenue'; }
  public static get STATISTICS_REPORT_PAYOUT(): string { return '/api/admin/statistics/report/payout'; }
  public static get STATISTICS_REPORT_REG(): string { return '/api/admin/statistics/report/reg'; }
  public static get STATISTICS_REPORT_REG_PERFORMERS(): string { return '/api/admin/statistics/report/reg/performers'; }
  public static get STATISTICS_FULL_REPORT_REG(): string { return '/api/admin/statistics/report/reg/full'; }
  public static get STATISTICS_REPORT_PARTNERSHIP_REQUEST(): string { return '/api/admin/statistics/report/partnership'; }

  public static get ALL_TASKS(): string { return '/api/admin/tasks'; }
  public static get DELETE_TASK(): string { return '/api/admin/tasks/delete'; }

  public static get ALL_ADVERTISING(): string { return '/api/advertising/all'; }
  public static get ADD_ADVERTISING(): string { return '/api/advertising/change/add'; }
  public static get EDIT_ADVERTISING(): string { return '/api/advertising/change/edit'; }
  public static get DELETE_ADVERTISING(): string { return '/api/advertising/change/delete'; }
  public static get ALL_PARTICIPANTS(): string { return '/api/admin/promotion/participants'; }
  public static get ADMIN_PROMOTION(): string { return '/api/admin/promotion'; }
  public static get ADMIN_PROMOTION_PHOTO(): string { return '/api/admin/promotion/photo'; }

  public static get CHANGE_STATUS_PAYMENT_PARTNER_PROMOTION(): string { return '/api/admin/promotion/change_payment'; }

  public static get ADMIN_ALL_NEWS(): string { return '/api/admin/news/all'; }
  public static get ADMIN_NEWS(): string { return '/api/admin/news'; }
  public static get ADMIN_NEWS_PHOTO(): string { return '/api/admin/news/photo'; }

  public static get FIELD_ACTIVITY(): string { return '/api/admin/filed_activity'; }
  public static get CATEGORY_FIELD_ACTIVITY(): string { return '/api/admin/filed_activity/photo'; }

  public static get ALL_VACANCIES(): string { return '/api/admin/vacancy'; }

  public static get ALL_RESUME(): string { return '/api/admin/resume'; }


}
