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
        }
        return info;
    }
    addSubItem(item) {
        item.URL = `${this.url}${item.URL}`;
        this
            .subMenu
            .push(item);
    }
}

let CONFIG = new MenuItem('config', 'Configuration', 'config', 'tool');
const PERMISSION = new MenuItem('permission', 'Permission', 'right').getInfo();
CONFIG.addSubItem(PERMISSION);
CONFIG = CONFIG.getInfo();

module.exports = {
    CONFIG,
    PERMISSION,
    MAP: [CONFIG]
}