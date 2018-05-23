import { Breadcrumb, Icon, Layout, Menu } from 'antd';
import React, { Component } from 'react'

import MENU from '../../config/menu';
import { Redirect } from 'react-router-dom'
import _ from 'lodash';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MENU_MAP = MENU.MAP;
const { CONFIG, PERMISSION } = MENU;
const ORG_NAME = 'Organization';
const ORG_ABBR = _.chain(ORG_NAME).head().toUpper().value();

class MainLayout extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: false,
            path: [CONFIG.NAME, PERMISSION.NAME]
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        const { key } = e;
        let path = [];
        for (let i = 0; i < MENU_MAP.length; i++) {
            const item = MENU_MAP[i];
            const { SUB_MENU } = item;
            const MAIN_NAME = item.NAME;
            for (let j = 0; j < SUB_MENU.length; j++) {
                const subItem = SUB_MENU[j];
                const { NAME, URL } = subItem;
                if (NAME === key) {
                    path = [MAIN_NAME, NAME];
                    this.setState({ path, redirect: URL });
                    break;
                }
            }
        }
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
    }
    render() {
        const { collapsed, path } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                {this.renderRedirect()}
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}>
                    <div className="logo" />
                    <div style={{ background: '#3c8dbc', textAlign: 'center', height: '64px', lineHeight: '64px', boxShadow: 'inset -5px 0 10px -5px #333' }}>
                        <span style={{ color: '#fff', fontSize: '20px' }}>
                            {collapsed ? (<div><b>{ORG_ABBR}</b>A</div>) : (<div><b>{ORG_NAME}</b>Admin</div>)}
                        </span>
                    </div>
                    <Menu onClick={this.handleClick} theme="dark" defaultOpenKeys={path} defaultSelectedKeys={path} mode="inline">
                        {
                            _.map(MENU_MAP, (group, gid) => {
                                let { URL, NAME, ICON, ALIAS, SUB_MENU } = group;
                                let result = (<div></div>);
                                if (_.get(SUB_MENU, 'length') > 0) {
                                    result = (<SubMenu
                                        key={NAME}
                                        title={<span><Icon type={ICON} /><span>{ALIAS}</span></span>}>
                                        {_.map(SUB_MENU, (item, index) => {
                                            let { URL, NAME, ALIAS, ICON } = item;
                                            return (
                                                <Menu.Item key={`${NAME}`}>{ALIAS}</Menu.Item>
                                            )
                                        })}
                                    </SubMenu>)
                                } else {
                                    result = (<Menu.Item key={gid}>
                                        <Icon type={ICON} />
                                        <span>{ALIAS}</span>
                                    </Menu.Item>)
                                }
                                return result;
                            })
                        }
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#3c8dbc', paddingLeft: '16px' }}>
                        <Icon
                            className="trigger"
                            style={{ fontSize: 18, color: '#fff' }}
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle} />
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            {
                                _.map(path, (item, index) => {
                                    return (<Breadcrumb.Item key={index}>{MENU[_.toUpper(item)].ALIAS}</Breadcrumb.Item>)
                                })
                            }
                        </Breadcrumb>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <strong>Copyright &copy; 2018-2019 The {ORG_NAME} Group.</strong> All rights reserved.
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

module.exports = MainLayout;
