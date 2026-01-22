/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SERVER,
  generateRobotsTxt: true,
  exclude: ['/admin*', '/user/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin*',
          '/user/*'
        ]
      },
    ],
  }
}

export default config