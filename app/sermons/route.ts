import RSS from "rss"


const TTL = 60 // Number of minutes feed can be cached before refreshing from source.

export async function GET() {

    const feed = new RSS({
        title: 'All Saints Church Crowborough',
        description: "All Saints Church Crowborough Media",
        generator: 'RSS for Node and Next.js',
        feed_url: 'https://www.davegray.codes/feed.xml',
        site_url: 'https://www.allsaintscrowborough.org/',
        managingEditor: '(Nick Holcombe)',
        webMaster: '(Nick Holcombe)',
        copyright: `Copyright ${new Date().getFullYear().toString()}, Nick Holcombe`,
        language: 'en-US',
        pubDate: new Date().toUTCString(),
        // ttl: TTL,
    });

    feed.item({
        title: "[Advent 2024] The seals",
        description: "Advent 2024 sermon series description",
        url: `https://www.allsaintscrowborough.org/Media/Player.aspx?media_id=334330&amp;fullpage=True`,
        categories: [],
        author: "Pete Winstone",
        date: "Sun, 15 Dec 2024 12:00:00 GMT",
        custom_elements: [
            "\t\t<item> <title>[Advent 2024] The seals</title> <description>Advent 2024 sermon series description</description> <guid isPermaLink=\"false\">m_334330</guid> <pubDate>Sun, 15 Dec 2024 12:00:00 GMT</pubDate> <link>https://www.allsaintscrowborough.org/Media/Player.aspx?media_id=334330&amp;fullpage=True</link> <itunes:summary>Advent 2024 sermon series summary</itunes:summary> <itunes:author>Pete Winstone</itunes:author> <itunes:duration>00:28:23</itunes:duration> <itunes:image href=\"https://raw.githubusercontent.com/AllSaintsCrowborough/sermon-feed/refs/heads/main/revelation.jpg\"/> <enclosure url=\"https://s3.us-east-1.amazonaws.com/media.1901.churchinsight.com/de2b5166-1ce4-4838-8a16-8a29f9d2c808.mp3\" type=\"audio/mpeg\" length=\"14037045\" /> </item>\n"
        ],
        enclosure: {
            url: "https://s3.us-east-1.amazonaws.com/media.1901.churchinsight.com/de2b5166-1ce4-4838-8a16-8a29f9d2c808.mp3"
        }
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
