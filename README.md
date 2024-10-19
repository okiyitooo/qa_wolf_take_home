# Hacker News Article Sorting Validator

This script uses Playwright to scrape the Hacker News website and verify that articles on the "newest" page are correctly sorted by their submission time.

## How it works:

1. **Launches a headless browser:** It uses Playwright to launch a headless Chromium browser, which allows it to interact with the website without a visible user interface.

2. **Navigates to Hacker News:** It navigates to the "newest" submissions page on Hacker News (`https://news.ycombinator.com/newest`).

3. **Extracts timestamps:** 
    * It extracts the timestamps of the first 100 articles. 
    * Since Hacker News displays 30 articles per page, the script iterates through multiple pages to collect the required number of timestamps.

4. **Parses timestamps:** It converts the extracted timestamp strings (e.g., "3 hours ago") into `Date` objects for easy comparison.

5. **Validates sorting:** It compares the timestamps to ensure they are in descending order (newest to oldest). If any articles are out of order, it throws an error.

6. **Outputs results:** If the articles are sorted correctly, it logs a success message to the console.

## Requirements

* Node.js
* Playwright

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
    ```
2. Install dependencies:

    ```bash
    cd <repository-directory>
    npm install playwright
    ```

3. Install browser dependencies (if needed):

    ```bash
    npx playwright install-deps
    ```

## Usage
1. Run the script:
    ```bash
    node index.js
    ```

## Notes
* The script is set to run in headless mode (headless: true) by default. This can be changed to false if you want to see the browser in action.
* The script was tested in a Gitpod environment, which requires setting headless: true and installing browser dependencies using npx playwright install-deps.