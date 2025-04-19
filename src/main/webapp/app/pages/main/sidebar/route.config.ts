import {
  ICON_CONFIG,
  ICON_DASHBOARD,
  ICON_ADMIN_MANAGEMENT,
  ICON_CHART,
  ICON_CUSTOMER,
  ICON_HISTORY_LOG,
  ICON_OTP,
  ICON_SYSTEM,
  ICON_USER_PERMISSION,
  ICON_LIST,
  ICON_USER,
} from '../../../shared/utils/icon';
import {
  SIDEBAR_ADMIN_AUTHORIZATION_ACCOUNTS_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_MANAGEMENT_TITLE,
  SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
  SIDEBAR_CLASS_DROPDOWN,
  SIDEBAR_CLASS_DROPDOWN_ITEM,
  SIDEBAR_CONFIGS_TITLE,
  SIDEBAR_CUSTOMERS_TITLE,
  SIDEBAR_HOME_TITLE,
  SIDEBAR_REPORTS_TITLE,
  SIDEBAR_SYSTEM_LOGGING_MANAGEMENT_TITLE,
  SIDEBAR_SYSTEM_MANAGEMENT_TITLE
} from '../../../constants/sidebar.constant';
import {Authorities} from '../../../constants/authorities.constants';
import {SidebarNavItem} from '../../../core/models/sidebar.model';

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
        permission: Authorities.ACCOUNT,
      },
      {
        path: '/roles',
        title: SIDEBAR_ADMIN_AUTHORIZATION_ROLES_MANAGEMENT_TITLE,
        icon: ICON_USER_PERMISSION,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.ROLE,
      }
    ],
  },
  {
    path: '/customers',
    title: SIDEBAR_CUSTOMERS_TITLE,
    icon: ICON_CUSTOMER,
    class: SIDEBAR_CLASS_DROPDOWN_ITEM,
    isExternalLink: false,
    permission: Authorities.CUSTOMER,
  },
  {
    path: '/report',
    title: SIDEBAR_REPORTS_TITLE,
    icon: ICON_LIST,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: Authorities.REPORT,
    submenu: [
      {
        path: '/register-customer-count',
        title: 'Tổng hợp số lượng KH đăng ký',
        icon: ICON_CHART,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.REPORT
      },
      {
        path: '/otp-customer-count',
        title: 'Tổng hợp số lượt sử dụng vé',
        icon: ICON_OTP,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.REPORT
      },
    ],
  },
  {
    path: '/system',
    title: SIDEBAR_SYSTEM_MANAGEMENT_TITLE,
    icon: ICON_SYSTEM,
    class: SIDEBAR_CLASS_DROPDOWN,
    isExternalLink: false,
    permission: [Authorities.SYSTEM],
    submenu: [
      {
        path: '/configs',
        title: SIDEBAR_CONFIGS_TITLE,
        icon: ICON_CONFIG,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.SYSTEM,
      },
      {
        path: '/logs',
        title: SIDEBAR_SYSTEM_LOGGING_MANAGEMENT_TITLE,
        icon: ICON_HISTORY_LOG,
        class: SIDEBAR_CLASS_DROPDOWN_ITEM,
        isExternalLink: false,
        permission: Authorities.SYSTEM_VIEW_LOGS,
      },
    ],
  }
];
