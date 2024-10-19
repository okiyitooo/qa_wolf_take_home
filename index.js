const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: true,  });
  const context = await browser.newContext();
  const page = await context.newPage();

  let nextPageUrl = "https://news.ycombinator.com/newest"; 

  // Get the first 100 article timestamps
  // ->
  const timestamps = [];

  // There are only 30 articles per page,
  // So I have to keep getting the "next page" until I have 100 timestamps
  while (nextPageUrl && timestamps.length < 100) {
    // go to Hacker News/newest
    // Start with the first page
    await page.goto(nextPageUrl);

    // Extract timestamps from the current page
    const newTimestamps = await page.evaluate(() => {
      const items = document.querySelectorAll(
        ".age"
      );
      return Array.from(items).map((item) => item.innerText);
    });
    timestamps.push(...newTimestamps);

    // Extrsct the 'next' and 'n' parameters for the next page
    nextPageUrl = await page.evaluate(() => {
      const moreLink = document.querySelector(".morelink");
      if (moreLink) {
        const url = new URL(moreLink.href);
        const next = url.searchParams.get("next");
        const n = url.searchParams.get("n");
        return `https://news.ycombinator.com/newest?next=${next}&n=${n}`;
      } else {
        return null; // No more pages
      }
    });
  }
  // Time stamps are gotten
  // console.log(timestamps)

  // Validate that the timestamps are sorted from newest to oldest
  for (let i = 0; i < timestamps.length - 1; i++) {
    const currentTimestamp = parseTimestamp(timestamps[i]);
    const nextTimestamp = parseTimestamp(timestamps[i + 1]);
    if (currentTimestamp < nextTimestamp) {
      throw new Error(`Articles aren't sorted correctly at index ${i}: ${timestamps[i]} > ${timestamps[i + 1]}`);
    }
  }

  console.log("The first 100 articles are sorted correctly from newest to oldest.");

  // Close the browser
  await browser.close();
}

// Helper function to parse timestamps 
// into Date() objects so I can compare them
function parseTimestamp(timestamp) {
  const [value, unit] = timestamp.split(' ');
  const now = new Date();
  switch (unit) {
    case 'minute':
    case 'minutes':
      return new Date(now.getTime() - value * 60 * 1000);
    case 'hour':
    case 'hours':
      return new Date(now.getTime() - value * 60 * 60 * 1000);
    case 'day':
    case 'days':
      return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}
// run the function
(async () => {
  await sortHackerNewsArticles();
})();