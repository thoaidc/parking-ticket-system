import {
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_CHART,
  ICON_USER_PERMISSION,
  ICON_USER, ICON_CUSTOMER_CARD,
} from '../../../../shared/utils/icon';
import {
  SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
  SIDEBAR_CLASS_DROPDOWN,
  SIDEBAR_CLASS_DROPDOWN_ITEM,
  SIDEBAR_HOME_TITLE,
  SIDEBAR_REPORTS_TICKET_SCAN_LOGS_TITLE,
  SIDEBAR_TICKETS_MANAGEMENT_TITLE
} from '../../../../constants/sidebar.constant';
import {Authorities} from '../../../../constants/authorities.constants';
import {SidebarNavItem} from '../../../../core/models/sidebar.model';

export const SIDEBAR_ROUTES: SidebarNavItem[] = [
  {
    path: '',
    title: SIDEBAR_HOME_TITLE,
    icon: ICON_DASHBOARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/admin',
    title: SIDEBAR_ADMIN_AUTHORIZATION_MANAGEMENT_TITLE,
    icon: ICON_ADMIN_MANAGEMENT,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.ACCOUNT, Authorities.ROLE],
    submenu: [
      {
        path: '/accounts',
        title: SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
        icon: ICON_USER,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ACCOUNT
      },
      {
        path: '/roles',
        title: SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
        icon: ICON_USER_PERMISSION,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE
      }
    ]
  },
  {
    path: '/tickets',
    title: SIDEBAR_TICKETS_MANAGEMENT_TITLE,
    icon: ICON_CUSTOMER_CARD,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: [Authorities.SYSTEM]
  },
  {
    path: '/ticket-scan-logs',
    title: SIDEBAR_REPORTS_TICKET_SCAN_LOGS_TITLE,
    icon: ICON_CHART,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: Authorities.REPORT
  }
];
