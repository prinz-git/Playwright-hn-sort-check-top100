const { test, expect } = require('@playwright/test');

test('Validate first 100 articles are sorted by newest to oldest and print timestamps', async ({ page }) => {
  // Navigate to Hacker News 'newest' page
  await page.goto('https://news.ycombinator.com/newest');

  // Wait for the `.age` elements to be visible on the page
  await page.waitForSelector('.subtext .age');

  // Extract the title attribute (exact timestamp) from the first 100 articles
  const timestamps = await page.$$eval('.subtext .age', (ages) =>
    ages.slice(0, 100).map((age) => {
      const timeText = age.getAttribute('title'); // Extract the exact timestamp from the title attribute
      const timestamp = new Date(timeText).getTime(); // Convert to a timestamp for comparison
      //console.log('Extracted timeText:', timeText); // Print the timeText in the browser context
      return { timeText, timestamp };
    })
  );

  // Print out the timestamps array in the Node.js context
  console.log('Extracted Timestamps:', timestamps);

  // Check that the timestamps are sorted from newest to oldest
  const isSorted = timestamps.every((entry, index, arr) => {
    return index === 0 || arr[index - 1].timestamp >= entry.timestamp;
  });

  // Print whether the list is sorted
  console.log('Is Sorted:', isSorted);

  // Assert that the articles are sorted
  expect(isSorted).toBe(true);
});
