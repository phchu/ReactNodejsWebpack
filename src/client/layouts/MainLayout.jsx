import React, { useEffect, useState } from 'react';
import { Avatar, Breadcrumb, Dropdown, Icon, Layout, Menu, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';

import * as MENU from '../../config/menu';
import { SIGN_OUT } from '../store/auth';
import { useStore } from '../store';

const {
  Header, Content, Footer, Sider
} = Layout;
const { SubMenu } = Menu;
const { MAP } = MENU;
const ORG_NAME = 'Organization';
const ORG_ABBR = _.chain(ORG_NAME)
  .head()
  .toUpper()
  .value();
let defaultPath = _.head(MAP);
defaultPath = defaultPath.SUB_MENU.length > 0 ?
  _.chain(defaultPath.SUB_MENU).head().get('URL').value() : defaultPath.URL;
const { confirm } = Modal;

const MainLayout = ({ location, history, children }) => {
  const { pathname } = location;
  const initialState = {
    collapsed: false,
    path: pathname === '/' ? _.words(defaultPath, /[^/]+/g) : _.words(pathname, /[^/]+/g)
  };
  const [{ auth }, dispatch] = useStore();
  const [state, setState] = useState(initialState);
  const { collapsed, path } = state;
  useEffect(
    () => {
      setState(initialState);
    },
    [location.pathname]
  );
  const name = _.get(auth, 'user.name');
  const altName = _.chain(name).head().toUpper().value();
  const handleClick = (e) => {
    const { key } = e;
    for (let i = 0; i < MAP.length; i += 1) {
      const item = MAP[i];
      const { SUB_MENU } = item;
      for (let j = 0; j < SUB_MENU.length; j += 1) {
        const subItem = SUB_MENU[j];
        const { NAME, URL } = subItem;
        if (NAME === key) {
          history.push(URL);
        } else history.push('/');
      }
    }
  };
  const toggle = () => setState({ collapsed: !collapsed });
  const showConfirm = () => {
    confirm({
      title: 'Sign Out?',
      content: 'Are you sure you want to sign out?',
      okText: 'Yes',
      onOk() {
        dispatch({ type: SIGN_OUT });
      }
    });
  };
  const handleMenuClick = (e) => {
    const { key } = e;
    switch (key) {
      case 'logout':
        showConfirm();
        break;
      default:
        break;
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="logout">
        <Icon type="logout" style={{ marginRight: '5px' }} />Logout
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <div
          style={{
            background: '#3c8dbc',
            textAlign: 'center',
            height: '64px',
            lineHeight: '64px',
            boxShadow: 'inset -5px 0 10px -5px #333'
          }}
        >
          <span style={{ color: '#fff', fontSize: '20px' }}>
            {collapsed ? (
              <div>
                <b>{ORG_ABBR}</b>
                A
              </div>) : (
                <div>
                  <b>{ORG_NAME}</b>
                  Admin
                </div>
              )}
          </span>
        </div>
        <Menu
          onClick={handleClick}
          theme="dark"
          defaultOpenKeys={path}
          defaultSelectedKeys={path}
          mode="inline"
        >
          {_.map(MAP, (group, gid) => {
            const {
              NAME, ICON, ALIAS, SUB_MENU
            } = group;
            let result = <div />;
            if (_.get(SUB_MENU, 'length') > 0) {
              result = (
                <SubMenu
                  key={NAME}
                  title={
                    <span>
                      <Icon type={ICON} />
                      <span>{ALIAS}</span>
                    </span>
                  }
                >
                  {_.map(SUB_MENU, (item) => {
                    const { NAME: SUB_NAME, ALIAS: SUB_ALIAS } = item;
                    return (
                      <Menu.Item key={`${SUB_NAME}`}>{SUB_ALIAS}</Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            } else {
              result = (
                <Menu.Item key={gid}>
                  <Icon type={ICON} />
                  <span>{ALIAS}</span>
                </Menu.Item>
              );
            }
            return result;
          })}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#3c8dbc', paddingLeft: '16px' }}>
          <Icon
            className="trigger"
            style={{ fontSize: 18, color: '#fff' }}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
          <div style={{ float: 'right' }}>
            <Dropdown overlay={menu}>
              <div>
                <Avatar alt={name} style={{ verticalAlign: 'middle', marginRight: '10px' }}>{altName}</Avatar><font color="white">{name}</font>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {_.map(path, (item, index) => (
              <Breadcrumb.Item key={index}>
                {_.get(MENU[_.toUpper(item)], 'ALIAS') && MENU[_.toUpper(item)].ALIAS}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <strong>Copyright &copy; 2019 - 2020 The {ORG_NAME} Group.</strong>{' '}
          All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

MainLayout.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(MainLayout);
