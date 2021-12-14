import { ROLE } from './role';

export class ApiUrls {
  public static get LOGIN_ACT(): string { return '/api/user'; }
  public static get LOGOUT_ACT(): string { return '/api/logout'; }

  public static get LOGIN_PROVIDE(): string { return '/api/oauth/authenticate/' }
  public static get LOGIN_PROVIDE_CONTINUE(): string { return '/api/oauth/authenticate/continue/' }

  public static get VERIFICATION(): string { return '/api/verification'; }
  public static get REGISTRATION(): string { return '/api/registration'; }
  public static get REGISTRATION_CHECK(): string { return '/api/check_registration'; }

  public static get REGISTRATION_CHECK_LEGAL_ENTITY(): string { return '/api/check_registration/legal_entity'; }
  public static get REGISTRATION_LEGAL_ENTITY(): string { return '/api/registration_legal_entity'; }


  public static get CHECK_PARTNER_FOR_PASSWORD_RECOVERY(): string { return '/api/password_recovery/check_partner'; }
  public static get PASSWORD_RECOVERY(): string { return '/api/password_recovery'; }

  public static get SUPPORT(): string { return '/api/support'; }
  public static get SURVEY(): string { return '/api/survey'; }
  public static get SHARE_PARTNERSHIP_REQUEST(): string { return '/api/request/member'};


  public static get PERFORMER_ROLE(): string { return '/api/partner/performer_role'}

  public static get SETTING(): string { return '/api/setting/user'; }
  public static get SETTING_AMOUNT_VALUE(): string { return '/api/setting/user/amount_value'; }
  public static get SETTING_ONLY_SUBSCRIPTION_VACANCY(): string { return '/api/setting/user/only_subscription_vacancy'; }
  public static get SETTING_ONLY_SUBSCRIPTION_RESUME(): string { return '/api/setting/user/only_subscription_resume'; }

  public static get OFFER_LOAD_APP(): string { return "/api/offer_load_app"; }

  public static get MAP_PATH_FROM_START_TO_END(): string { return '/api/map/path_start_to_end'; }
  public static get CREATE_PAYMENT(): string { return '/api/v1/payment/yandex/pay_info'; }
  public static get REFILL_PAYMENT(): string { return '/api/v1/payment/yandex/refill'; }
  public static get PAYMENT(): string { return '/api/partner/payments/'; }
  public static get PAYMENT_SUBSCRIPTION(): string { return '/api/partner/payments/subscribe'; }
  public static get PAYMENT_DATE_END_SUBSCRIPTION(): string { return '/api/partner/payments/date_end_subscription'; }
  public static get PAYMENT_INCOME(): string { return '/api/partner/payments/income'; }
  public static get GET_PAYMENT(): string { return '/api/v1/payment/yandex/'; }
  public static get ALL_PAYMENTS(): string { return '/api/partner/payments/all'; }
  public static get COMMISSION(): string { return '/api/partner/payments/commissions'; }

  public static get TASK_MARK_AS_PAYED(): string { return '/api/v1/payment/yandex/mark_as_payed'; }
  public static get TASK_MARK_REFILL_AS_PAYED(): string { return '/api/v1/payment/yandex/mark_refill_as_payed'; }


  public static get CATEGORIES(): string { return '/api/category'; }
  public static get TASKS(): string { return '/api/tasks/'; }
  public static get CHECK_TASK(): string { return '/api/tasks/check'; }


  public static get SHORT_TASKS_INFO(): string { return '/api/tasks/short_tasks'; }
  public static get SHORT_LAST_THREE_TASKS(): string { return '/api/tasks/last_three'; }
  public static get SHORT_TASKS_INFO_HISTORY(): string { return '/api/tasks/short_tasks/history'; }

  public static get SHORT_PARTNERS_INFO(): string { return '/api/performer/info/all'; }
  public static get USED_CITIES(): string { return '/api/partner/tasks/cities'; }

  public static get SHORT_MEMBERS_INFO(): string { return '/api/performer/info/all/members'; }
  public static get SHORT_LEGAL_ENTITIES_MEMBERS_INFO(): string { return '/api/performer/info/all/members/legal_entities'; }

  public static get SHORT_ADVERTISING(): string { return '/api/advertising/view'; }


  //TODO move to partner urls as adminUrls
  public static get PARTNER_TASKS(): string { return '/api/partner/tasks/'; }
  public static get MY_AVAILABLE_SHORT_TASKS_INFO(): string { return '/api/partner/tasks/my_available_short_tasks'; }
  public static get OFFER_SHORT_TASKS_INFO(): string { return '/api/partner/tasks/offer_task_to_performer'; }
  public static get PARTNER_TASK_DOC(): string { return '/api/partner/tasks/doc'; }
  public static get PARTNER_TASK_DOC_DOWNLOAD(): string { return '/api/partner/tasks/doc/download' }

  public static get PARTNER_UPDATE_TASK(): string { return '/api/partner/tasks/update'; }


  public static get MY_TASKS_INFO(): string { return '/api/partner/tasks/short_tasks'}
  public static get MY_PERFORM_TASKS_INFO(): string { return '/api/partner/tasks/perform_short_tasks'}
  public static get SWITCH_STATUS_TASK(): string { return '/api/partner/tasks/switch_status/'}
  public static get MY_PERFORM_TASK_CREATOR_INFO(): string { return '/api/partner/tasks/perform_task/creator_info/'}
  public static get MY_PERFORM_TASK_PERFORMER_INFO(): string { return '/api/partner/tasks/performer_info/'}

  public static get PARTNER_TASK_PERFORMER(): string { return '/api/partner/tasks/performer/';}
  public static get PARTNER_TASK_CREATOR(): string { return '/api/partner/tasks/creator/';}

  public static get PARTNER_INFO(): string {return '/api/partner/info/current/'}
  public static get VALIDATE_PARTNER_INFO(): string {return '/api/partner/info/current/validate'}
  public static get VALIDATE_FILLING_PERFORMER_INFO(): string {return '/api/partner/info/current/performer/validate'}
  public static get PERFORMER_INFO(): string {return '/api/partner/info/current/performer'}
  public static get PARTNER_IMAGE_WORK_EXAMPLE(): string {return '/api/partner/info/work_example'}

  public static get PARTNER_INFO_SUBSCRIBE(): string {return '/api/partner/info/subscription'}

  public static get PARTNER_CONF(): string {return '/api/partner/info/current/conf'}

  public static get PARTNER_GEO_CITY(): string {return '/api/partner/info/geo_city/'}
  public static get PARTNER_INFO_PASSWORD(): string {return '/api/partner/info/password/'}
  public static get THREE_PARTNER_INFO_FOR_THE_CATEGORY_CONSTRUCTION(): string {return '/api/partner/info/category_construction'}

  public static get LEGAL_ENTITY_INFO(): string { return '/api/legal_entity/info/current' };
  public static get SEND_REQUEST_MEMBER(): string { return '/api/legal_entity/info/request/member'; }

  public static get USER_PHOTO(): string {return '/api/partner/info/photo/'}

  public static get SHORT_COMMENTS(): string { return '/api/partner/comments/'}

  public static get SHORT_TASK_COMMENTS(): string { return '/api/partner/comments/task/'}

  public static get CHECK_PARTNER_COMMENT(): string { return '/api/partner/comments/check/'}

  public static get ALL_CATEGORY_NAMES(): string { return '/api/category/name/'}
  public static get SHORT_CATEGORY(): string { return '/api/partner/categories'}
  public static get ALL_CATEGORY_NAMES_FOR_HOME(): string { return '/api/category/home/name/'}
  public static get ALL_ROOT_CATEGORIES_WITH_CHILDREN(): string { return '/api/category/all/home/categories'}

  public static get PARTNER_TASKS_CALC_PAY(): string { return '/api/tasks/calc_pay'; }
  public static get PARTNER_HOUR_MESSAGE(): string { return '/api/tasks/hour_message'; }


  public static get UNLOCK_USER(): string { return '/api/partner/info/unlock'; }
  public static get CHECK_BLOCKING(): string { return '/api/partner/info/check/blocking'; }
  public static get CHECK_BLOCKING_PARTNER(): string { return '/api/partner/info/check/blocking/partner'; }

  public static get ALL_ROOT_FIELDS_ACTIVITY(): string { return '/api/partner/filed_activity'}
  public static get ALL_FIELDS_ACTIVITY(): string { return '/api/partner/filed_activity/all'}
  public static get ALL_FIELDS_ACTIVITY_JOB_FieldActivity(): string { return '/api/field_activity/job/name'}

  public static get ALL_SHORT_VACANCY(): string { return '/api/vacancies/all';}
  public static get VACANCY(): string { return '/api/vacancies';}
  public static get SHORT_LAST_THREE_VACANCY(): string { return '/api/vacancies/last_three'; }
  public static get CHECK_VACANCY(): string { return '/api/vacancies/check';}

  public static get PARTNER_CREATE_VACANCY(): string { return '/api/partner/vacancy/create'; }
  public static get PARTNER_UPDATE_VACANCY(): string { return '/api/partner/vacancy/update'; }
  public static get ALL_MY_SHORT_VACANCY(): string { return '/api/partner/vacancy/creator/all';}
  public static get PARTNER_VACANCY(): string { return '/api/partner/vacancy';}
  public static get MARK_VACANCY(): string { return '/api/partner/vacancy/favorite';}
  public static get OFFER_VACANCY(): string { return '/api/partner/vacancy/offer';}
  public static get VACANCIES_OFFER(): string { return '/api/partner/vacancy/vacancies_offer';}
  public static get SWITCH_STATUS_VACANCY(): string { return '/api/partner/vacancy/switch';}
  public static get VACANCY_CREATOR_INFO(): string { return '/api/partner/vacancy/creator_info';}
  public static get VACANCIES_SUBMITTED_RESUME(): string { return '/api/partner/vacancy/submitted_resume';}
  public static get FAVORITE_VACANCIES(): string { return '/api/partner/vacancy/favorites';}
  public static get SHOWING_VACANCIES(): string { return '/api/partner/vacancy/showing';}
  public static get CREATOR_VACANCY(): string { return '/api/partner/vacancy/creator';}
  public static get WORKER_VACANCY(): string { return '/api/partner/vacancy/worker';}

  public static get ALL_RESUME(): string { return '/api/resume/all';}
  public static get LAST_THREE_RESUME(): string { return '/api/resume/last_three';}
  public static get RESUME(): string { return '/api/resume';}

  // Resume
  public static get PARTNER_CREATE_RESUME(): string {return '/api/partner/resume/create'}
  public static get PARTNER_UPDATE_DEFAULT_RESUME(): string {return '/api/partner/resume/default/update'}
  public static get PARTNER_DEFAULT_RESUME(): string {return '/api/partner/resume/default'}
  public static get PARTNER_RESUME(): string {return '/api/partner/resume'}
  public static get VACANCY_CREATE_RESUME(): string {return '/api/partner/resume/create/vacancy'}
  public static get ALL_RESUME_VACANCY(): string {return '/api/partner/resume/vacancy'}
  public static get PARTNER_FAVORITES_RESUME(): string {return '/api/partner/resume/favorites'}
  public static get MARK_RESUME(): string { return '/api/partner/resume/favorite';}
  // public static get CHECK_RESUME(): string { return '/api/partner/resume/check';}
  public static get SHOWING_RESUME(): string { return '/api/partner/resume/showing';}
  public static get RESUME_CREATOR_INFO(): string {return '/api/partner/resume/customer_info'}

  //PERFORMER SECTION
  public static get TASK_REQUEST(): string { return '/api/performer/task/requests/'; }
  public static get PERFORMER_TASKS(): string { return '/api/partner/tasks/perform_task/'; }
  public static get USER_TASK_REQUEST(): string { return '/api/performer/task/requests/user'; }
  public static get USER_TASK_REQUEST_COUNT(): string { return '/api/performer/task/requests/user/count'; }
  public static get CHECK_TASK_REQUEST(): string { return '/api/performer/task/requests/check'; }


  //not only performer (customer can use it)
  public static get PERFORMER_TASK_REQUEST_CHANGE_STATUS(): string { return '/api/performer/task/requests/change_status'; }
  public static get PERFORMER_TASK_REQUEST(): string { return '/api/performer/task/requests/'; }

  public static get PERFORMER_TASK_REQUEST_TRADE(): string { return '/api/performer/task/requests/trade'; }

  //pay
  public static get PAY_BINDING_CUSTOMER_CARD_PARAMS(): string { return '/api/partner/pay_task/binding_customer_card_params'; }
  public static get PAY_BINDING_PERFORMER_CARD_PARAMS(): string { return '/api/partner/pay_task/binding_performer_card_params'; }

  public static get PAY_CUSTOMER_PAYMENT_TOOLS(): string { return '/api/partner/pay_task/customer_tools'; }
  public static get PAY_PERFORMER_PAYMENT_TOOLS(): string { return '/api/partner/pay_task/performer_tools'; }

  public static get PAY_BIND_CUSTOMER_PAYMENT(): string { return '/api/partner/tasks/bind_customer_payment_tool'; }

  public static get PAY_TASK(): string { return '/api/partner/pay_task/pay_task'; }
  public static get PAY_CHECK_DEAL(): string { return '/api/partner/pay_task/check_deal'; }
  public static get PAY_CHECK_PAYMENT_DEAL(): string { return '/api/partner/pay_task/check_payment_deal'; }
  public static get REQUEST_PAYOUT(): string { return '/api/partner/pay_task/request_payout'; }

  public static get PARTNER_PAYMENT_VACANCY(): string { return '/api/partner/vacancy/payments/'; }
  public static get PARTNER_PAYMENT_VACANCY_RATE_VACANCY(): string { return '/api/partner/vacancy/payments/rate_job'; }
  //

  public static get MY_SHARE(): string { return '/api/partner/share/my'; }
  public static get PARTNER_SHARE(): string { return '/api/partner/share'; }
  public static get PARTNER_PARTICIPATION_PROMOTION(): string { return '/api/partner/share/participate' }

  public static get ALL_PROMOTIONS_FOR_HOME(): string { return '/api/promotion/home'}



  //chat
  public static get CHATS_COMMON(): string { return '/api/partner/chat/common/all'; }
  public static get CHAT_COMMON(): string { return '/api/partner/chat/common/'; }
  public static get CHAT_COMMON_VACANCY(): string { return '/api/partner/chat/common/vacancies/'; }
  public static get CHAT(): string { return '/api/partner/chat/'; }
  public static get CHAT_MESSAGES(): string { return '/api/partner/chat/common/messages/'; }
  public static get CHAT_MARK_AS_READ(): string { return '/api/partner/chat/markAsRead/'; }
  public static get CHAT_COMMON_UPLOAD_FILE(): string { return '/api/partner/chat/upload/'; }
  public static get CHAT_COMMON_GET_FILE(): string { return '/api/partner/chat/common/file/'; }
  public static get CHECK_CHAT(): string { return '/api/partner/chat/common/check' }
  public static get CHECK_CHAT_MESSAGE(): string { return '/api/partner/chat/common/message/check' }

  public static get CHAT_COMMON_WITH_ADMIN(): string { return '/api/partner/chat/common/admin'; }

  public static get CHATS_ARBITRATION(): string { return '/api/partner/chat/arbitration/all'; }
  public static get CHAT_ARBITRATION(): string { return '/api/partner/chat/arbitration/'; }

  public static get CHATS_ARBITRATION_RESOLUTION(): string { return '/api/partner/chat/arbitration/resolution/'; }

  public static get CHATS_ARBITRATION_CANCEL_RESOLUTION(): string { return '/api/partner/chat/arbitration/cancel_resolution/'; }
  public static get CHATS_ARBITRATION_REQUEST_ADMIN_HELP(): string { return '/api/partner/chat/arbitration/request_admin_help/'; }

  public static get COMMON_INTERACTIVE(): string { return '/wsapi/websocket'; }
  public static get NOTIFICATION(): string { return '/api/common/notification/'; }
  public static get NOTIFICATION_MARK_READ(): string { return '/api/common/notification/markAsRead/'; }

  public static get COMMON_NOTIFICATION(): string { return '/api/common/notification/my/'; }
  public static get CHAT_NOTIFICATION_INTERACTIVE(): string { return '/api/web_chat_notification'; }
  public static get NOTIFICATION_INTERACTIVE(): string { return '/api/notification'; }

  public static get ALL_PROMOTIONS(): string { return '/api/promotion/all'; }
  public static get PROMOTION(): string { return '/api/promotion'; }
  public static get ALL_PROMOTIONS_PROMO_CODE(): string { return '/api/promotion/all/promo_code'; }


  public static get ALL_NEWS(): string { return '/api/news/all'; }
  public static get NEWS(): string { return '/api/news'; }
  public static get LASTS_NEWS(): string { return '/api/news/lasts'; }
}

export class ActiveUrls {
  public static LOGIN = 'login';
  public static REGISTRATION = 'registration';

  public static REG_INDIVID = 'individual';
  public static REG_LEGAL = 'legal_entity';


  public static NEW_TASK = 'new_task';
  public static FIND_TASK = 'find_task';
  public static PERFORMERS = 'performers';
  public static PROMOTION = 'promotion';

  public static SUPPORT = 'support';

  public static NEW_VACANCY = 'job/create_vacancy';
  public static FIND_VACANCIES = 'job/find_vacancy';
  public static FIND_RESUME = 'job/find_resume';


  public static ADMIN_USERS = 'admin/users';
  public static ADMIN_CATEGORIES = 'admin/categories';
  public static ADMIN_PAYOUTS = 'admin/payouts';
  public static ADMIN_COMMISSIONS = 'admin/commissions';
  public static ADMIN_RATES = 'admin/common_rates';
  public static ADMIN_REGION_RATES = 'admin/region_rates';
  public static ADMIN_USER_RATES = 'admin/user_rates';
  public static ADMIN_STATISTICS = 'admin/statistics';
  public static ADMIN_ADVERTISES = 'admin/advertises';
  public static ADMIN_CHATS = 'admin/chats';
  public static ADMIN_LEGAL_ENTITIES = 'admin/legal_entities';
  public static ADMIN_BLOCKED_USERS = 'admin/blocked_users';
  public static ADMIN_NEWS = 'admin/news';
  public static ADMIN_FILDS_ACIVITY = 'admin/fields_activity';
  public static ADMIN_USERS_VACANCIES = 'admin/users_vacancies';
  public static ADMIN_USERS_RESUME = 'admin/users_resume';

  public static PARTNER_PROFILE = 'profile';
  public static PARTNER_MY_TASKS = 'my-tasks';
  public static EXECUTOR_TASKS = 'executor-tasks';
  public static PARTNER_EXECUTOR_PANEL = 'executor-panel';

  public static PARTNER_VACANCY = 'my-vacancies';
  public static PARTNER_RESUME = 'my-resume';
  public static PARTNER_FAVORITE_JOB = 'my-favorite';
  public static MY_REQUESTS = 'my-requests-resume';


  public static PARTNER_PAYMENTS = 'payments';
  public static PARTNER_RATES = 'rates';
  public static ONE_TIME_PAYMENTS = 'one_time_payments';
  public static SUBSCRIPTIONS = 'subscriptions';

  public static PARNTER_NOTIFICATION = 'notification';
  public static PARNTER_SHARE = 'share';

  public static TASK_UPDATE = 'update';

  public static ADMIN_MY_ARBITRATIONS = 'my_arbitrations';
  public static ADMIN_ALL_ARBITRATIONS = 'all_arbitrations';
  public static ADMIN_TASK_CHATS = 'task_chats';
  public static ADMIN_VACANCY_CHATS = 'vacancy_chats';
  public static ADMIN_MY_CHATS = 'my_chats';

  public static ADMIN_COMMON_STATISTICS = 'common_statistics';
  public static ADMIN_USER_STATISTICS = 'user_statistics';
  public static ADMIN_JOB_STATISTICS = 'job_statistics';

  public static ADMIN_DEVELOPMENT = 'admin/development';
  public static ADMIN_FAKE_PARTNERS = 'partners';
  public static ADMIN_FAKE_TASKS = 'tasks';
  public static ADMIN_TASKS_MONITORING = 'admin/tasks_monitoring';
  public static ADMIN_PROMOTION = 'admin/promotion';

}

export const MainSectionUrls = [
  ActiveUrls.PARTNER_PROFILE,
  ActiveUrls.PARTNER_MY_TASKS,
  ActiveUrls.EXECUTOR_TASKS,
  ActiveUrls.PARTNER_EXECUTOR_PANEL,
  ActiveUrls.PARTNER_RATES,
  ActiveUrls.PARTNER_VACANCY,
  ActiveUrls.PARTNER_RESUME,
  ActiveUrls.PARTNER_FAVORITE_JOB,
];

export const BASE_URLS_FOR_ROLES = {
  [ROLE.SUPER_USER]: ['/admin', '/user'],
  [ROLE.PARTNER]: ['/user'],
}
