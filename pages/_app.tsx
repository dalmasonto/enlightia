import React from 'react'
import NextApp, { AppProps, AppContext } from 'next/app';
import Head from 'next/head'
import { getCookie } from 'cookies-next'
import MainProvider from '../layouts/MainProvider'
import { APP_NAME, DEFAULT_APP_URL, THEME_COOKIE_NAME } from '../config/constants'
import { MantineColorScheme } from '@mantine/core';
import NextNprogress from 'nextjs-progressbar';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import './../styles/global.css'
import '@mantine/charts/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import '@/styles/tiptap.scss'
import Script from 'next/script';

// This is to allow different pages to have different layouts since we are not using the app directory.
type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<{ children: React.ReactNode }>,
  },
  colorScheme: MantineColorScheme,
  user: any,
}

export default function App({ Component, pageProps, colorScheme }: ComponentWithPageLayout) {
  return (
    <>
      <NextNprogress color='#AE3EC9' options={{trickle: true}} />
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" type="image/x-icon" href="/assets/images/icons/ico.png" />
      </Head>
      {/* <Script src="https://embed.tawk.to/619959c96885f60a50bcbe1e/1fkvgdfr8" strategy='afterInteractive' /> */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-4V06PJ8YGN" strategy='afterInteractive' async />
      <Script src={`${DEFAULT_APP_URL}/static/js/googleanalytics.js`} strategy='afterInteractive' />
      <MainProvider colorScheme={colorScheme}>
        {
          Component.PageLayout ? (
            <Component.PageLayout>
              <Component {...pageProps} />
            </Component.PageLayout>
          )
            :
            <Component {...pageProps} />
        }
      </MainProvider>
    </>
  );
}


App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie(THEME_COOKIE_NAME, appContext.ctx) || 'dark',
    // user: getCookie(LOCAL_STORAGE_KEYS.user, appContext.ctx) || null,
    // loginStatus: getCookie(LOCAL_STORAGE_KEYS.login_status, appContext.ctx) || false,
  };
};