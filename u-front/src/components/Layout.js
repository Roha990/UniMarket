import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";

import { Layout, theme } from 'antd';

const {Content, Footer } = Layout;

const LayoutBase = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{height: '100%'}}>
            <Content style={{ padding: '0 48px' }}>
                <Navbar></Navbar>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        height: '100%'
                    }}
                >
                    <Outlet></Outlet>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default LayoutBase;
