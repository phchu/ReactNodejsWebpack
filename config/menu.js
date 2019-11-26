import _ from 'lodash';

class MenuItem {
  constructor(name, alias, icon) {
    this.url = `/${name}`;
    this.alias = alias;
    this.name = name;
    this.icon = icon;
    this.subMenu = [];
  }
  getInfo() {
    const info = {
      URL: this.url,
      NAME: this.name,
      ALIAS: this.alias,
      ICON: this.icon,
      SUB_MENU: this.subMenu
    };
    return info;
  }
  addSubItem(item) {
    _.assign(item, {
      URL: `${this.url}${item.URL}`
    });
    this
      .subMenu
      .push(item);
  }
}

const config = new MenuItem('config', 'Configuration', 'setting');
const PERMISSION = new MenuItem('permission', 'Permission', 'right').getInfo();
config.addSubItem(PERMISSION);
const CONFIG = config.getInfo();
const MAP = [CONFIG];
export {
  CONFIG,
  PERMISSION,
  MAP
};
