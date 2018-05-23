class MenuItem {
    constructor(url, alias, name, icon) {
        this.url = url;
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
        this
            .subMenu
            .push(item);
    }
}

let CONFIG = new MenuItem('/config', 'Configuration', 'config', 'tool');
const PERMISSION = new MenuItem('/config', 'Permission', 'permission', 'right').getInfo();
CONFIG.addSubItem(PERMISSION);
CONFIG = CONFIG.getInfo();

module.exports = {
    CONFIG,
    PERMISSION,
    MAP: [CONFIG]
}