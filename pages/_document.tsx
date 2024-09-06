import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>
            The CREDIT Protocol
          </title>
          <meta
            name="description"
            content="Redefining the boundaries of open finance and granting users access to a secure, inclusive, and composable credit base layer."
            />
          <link rel="stylesheet" href="/styles/global.css" />
          <link rel="stylesheet" href="/fonts/Neue/Neue.css" />
          <link rel="stylesheet" href="/fonts/Retron2000/Retron2000.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
