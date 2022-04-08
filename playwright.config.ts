import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
    retries: 1,
    workers: 2,
    testDir: './src/tests',
    use: {
        screenshot: 'only-on-failure'
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
};
export default config;