# feedkit

```js
import { Rss } from 'feedkit';

const rss = new Rss({
  title: 'TITLE',
  description: 'DESCRIPTION',
  link: 'LINK',
  items: [
    {
      title: 'TITLE',
      description: 'DESCRIPTION',
      link: 'LINK',
      pubDate: new Date(),
    },
    {
      title: 'TITLE',
      description: 'DESCRIPTION',
      link: 'LINK',
      pubDate: new Date(),
    },
    {
      title: 'TITLE',
      description: 'DESCRIPTION',
      link: 'LINK',
      pubDate: new Date(),
    },
  ],
});

console.log(rss.toString());
```

```xml
<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>TITLE</title>
    <description>DESCRIPTION</description>
    <link>LINK</link>
    <item>
      <title>TITLE</title>
      <description>DESCRIPTION</description>
      <link>LINK</link>
      <pubDate>Thu, 01 Jan 1970 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>TITLE</title>
      <description>DESCRIPTION</description>
      <link>LINK</link>
      <pubDate>Thu, 01 Jan 1970 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>TITLE</title>
      <description>DESCRIPTION</description>
      <link>LINK</link>
      <pubDate>Thu, 01 Jan 1970 00:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>
```
