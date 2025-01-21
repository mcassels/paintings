import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getIsMobile, reportAnalytics } from "../utils";
import { Header } from "antd/es/layout/layout";
import ContactUsModal from "./contactus/ContactUsModal";
import { Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import AppFooter from "./AppFooter";

interface LayoutMenuItem {
  key: string;
  title: string;
  route: string;
  openInNewTab?: boolean;
}

interface LayoutProps {
  menuItems: LayoutMenuItem[];
  headerContent: JSX.Element;
}

function Layout(props: LayoutProps) {
  const { headerContent, menuItems } = props;

  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1];

  useEffect(() => {
    if (location.search.length === 0) {
      reportAnalytics('view_page', { page: selectedKey });
    }
  }, [selectedKey, location.search.length]);

  const headerElem = (
    <Header className="bg-[#193259] text-white text-center justify-center flex flex-col text-3xl p-[8px] h-fit mb-6">
      {headerContent}
    </Header>
  );

  // Menu needs different layout for mobile
  const isMobile = getIsMobile();

  const menuStyle = isMobile ?
    { maxWidth: '60px', flex: 'auto', marginBottom: '1.5rem', backgroundColor: '#193259' } : { width: 'fit-content' }

  return (
    <div className="min-h-svh flex flex-col items-stretch">
      <ContactUsModal />
      <div className="grow">
        {
          !isMobile && headerElem
        }
        <div className="box wrapper">
          <div className="box sidebar">
            <Menu
              mode={isMobile ? 'horizontal' : 'vertical'}
              style={menuStyle}
              defaultSelectedKeys={[selectedKey]}
              selectedKeys={[selectedKey]}
              overflowedIndicator={isMobile ? <MenuOutlined /> : null}
            >
              {menuItems.map(item => {
                const content = item.openInNewTab ? (
                  <div className="flex gap-x-2">
                    {item.title}
                    <div>
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </div>
                  </div>
                ) : item.title;
                return (
                  <Menu.Item key={item.key} title={item.title}><NavLink to={item.route} target={item.openInNewTab ? '_blank' : undefined}>{content}</NavLink></Menu.Item>
                );
              })}
            </Menu>
            {isMobile && <div className="w-full">{headerElem}</div>}
          </div>
          <div className="box content">
            <Outlet />
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
}

export default Layout;