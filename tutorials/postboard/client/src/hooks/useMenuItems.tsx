import { useMemo } from 'react';
import { HomeSvg, ProfileSvg, ListSvg, BookmarkSvg, NotificationSvg, SettingsSvg } from '../assets/icons';
import { MenuItem } from './types';

type MenuItemProps = {
  isLoggedIn: boolean;
};

const menuItems: Array<MenuItem> = [
  { iconComponent: HomeSvg, label: 'Home', route: '/' },
  { iconComponent: ProfileSvg, label: 'Profile', route: '/' },
  { iconComponent: ListSvg, label: 'User list', route: '/' },
  { iconComponent: BookmarkSvg, label: 'Bookmarks', route: '/' },
  { iconComponent: NotificationSvg, label: 'Notifications', route: '/' },
  { iconComponent: SettingsSvg, label: 'Settings', route: '/' },
];

const useMenuItems = ({ isLoggedIn }: MenuItemProps): Array<MenuItem> => {
  const items = useMemo(() => {
    if (!isLoggedIn) {
      return [menuItems[0]];
    } else {
      return menuItems;
    }
  }, [isLoggedIn]);
  return items;
};

export default useMenuItems;
