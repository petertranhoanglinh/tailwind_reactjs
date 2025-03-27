"use client";

import React, { ReactNode } from "react";
import { useState } from "react";
import { mdiForwardburger, mdiBackburger, mdiMenu } from "@mdi/js";
import menuAside from "./_lib/menuAside";
import menuNavBar from "./_lib/menuNavBar";
import Icon from "../_components/Icon";
import NavBar from "./_components/NavBar";
import NavBarItemPlain from "./_components/NavBar/Item/Plain";
import AsideMenu from "./_components/AsideMenu";
import FooterBar from "./_components/FooterBar";
import FormField from "../_components/FormField";
import { Field, Form, Formik } from "formik";
import { MenuAsideItem } from "../_interfaces";
import Link from "next/link";

type Props = {
  children: ReactNode;
};

export default function LayoutAuthenticated({ children }: Props) {
  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false);
  const [isAsideLgActive, setIsAsideLgActive] = useState(false);
  const [itemsMenuSearch, setItemsMenuSearch] = useState<MenuAsideItem[]>([]);

  const handleRouteChange = () => {
    setIsAsideMobileExpanded(false);
    setIsAsideLgActive(false);
  };

  const layoutAsidePadding = "xl:pl-60";

  const search = (key: string) => {
    const items = searchMenu(key, menuAside)
    if (items.length > 0) {
      setItemsMenuSearch(items);
    } else {
      alert("No information menu")
    }
  }

  const searchMenu = (key: string, menuItems: MenuAsideItem[]): MenuAsideItem[] => {
    const lowerKey = key.toLowerCase();

    const searchRecursive = (items: MenuAsideItem[]): MenuAsideItem[] => {
      return items
        .map((item) => {
          const matched = item.label.toLowerCase().includes(lowerKey);
          const filteredSubMenu = item.menu ? searchRecursive(item.menu) : [];
          if (matched || filteredSubMenu.length > 0) {
            return {
              ...item,
              menu: filteredSubMenu.length > 0 ? filteredSubMenu : undefined,
            };
          }
          return null;
        })
        .filter(Boolean) as MenuAsideItem[];
    };

    return searchRecursive(menuItems);
  };

  return (
    <>
      <div className="overflow-hidden lg:overflow-visible">
        <div
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""
            } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
        >
          <NavBar
            menu={menuNavBar}
            className={`${layoutAsidePadding} ${isAsideMobileExpanded ? "ml-60 lg:ml-0" : ""
              }`}
          >
            <NavBarItemPlain
              display="flex lg:hidden"
              onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
            >
              <Icon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
            </NavBarItemPlain>
            <NavBarItemPlain display="hidden lg:flex xl:hidden" onClick={() => setIsAsideLgActive(true)}>
              <Icon path={mdiMenu} size="24" />
            </NavBarItemPlain>
            <NavBarItemPlain useMargin>
              <Formik initialValues={{ search: "" }} onSubmit={(values) => search(values.search)}>
                <Form>
                  <FormField isBorderless isTransparent>
                    {({ className }) => (
                      <Field name="search" placeholder="Search" className={className} />
                    )}
                  </FormField>
                </Form>
              </Formik>
            </NavBarItemPlain>
          </NavBar>
          <AsideMenu
            isAsideMobileExpanded={isAsideMobileExpanded}
            isAsideLgActive={isAsideLgActive}
            menu={menuAside}
            onAsideLgClose={() => setIsAsideLgActive(false)}
            onRouteChange={handleRouteChange}
          />
          {itemsMenuSearch.length > 0 && (
            <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                {itemsMenuSearch.map((item) => (
                  <li key={item.label} className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition">
                    <Link href={item.href ?? "#"} className="flex items-center space-x-2" onClick={(e) => {
                      if (!item.href) e.preventDefault();
                    }}>
                      <span>{item.label}</span>
                    </Link>
                    {item.menu && item.menu.length > 0 && (
                      <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
                        {item.menu.map((subItem) => (
                          <li key={subItem.label} className="p-1 hover:text-blue-500">
                            <Link href={item.href ?? "#"} onClick={(e) => {
                              if (!item.href) e.preventDefault();
                            }}>{subItem.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {children}
          <FooterBar>
            <></>
          </FooterBar>
        </div>
      </div>
    </>
  );
}
