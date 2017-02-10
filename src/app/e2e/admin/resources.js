import { until, By } from 'selenium-webdriver';
import expect from 'expect';

import driver from '../../../common/tests/chromeDriver';
import { clear, loadFixtures } from '../../../common/tests/fixtures';
import fixtures from './resources.json';
import { elementIsClickable } from '../../../common/tests/conditions';

describe('Admin', () => {
    describe('Resource management', function homePublishedDataTests() {
        this.timeout(10000);
        const DEFAULT_WAIT_TIMEOUT = 9000; // A bit less than mocha's timeout to get explicit errors from selenium

        before(async () => {
            await clear(); // Had to ensure clear state for unknown reason
            await loadFixtures(fixtures);
            await driver.get('http://localhost:3010/');

            const button = await driver.findElement(By.css('.appbar button'));
            await driver.wait(elementIsClickable(button), DEFAULT_WAIT_TIMEOUT);
            await button.click();

            const buttonSignIn = await driver.findElement(By.css('.btn-sign-in'));
            await driver.wait(elementIsClickable(buttonSignIn), DEFAULT_WAIT_TIMEOUT);
            await buttonSignIn.click();

            const form = await driver.findElement(By.css('.dialog-login form'));
            const username = await driver.findElement(By.css('input[name=username]'));
            const password = await driver.findElement(By.css('input[name=password]'));
            await driver.sleep(500);

            await username.sendKeys('user');
            await password.sendKeys('secret');
            await form.submit();
            await driver.wait(until.stalenessOf(form), DEFAULT_WAIT_TIMEOUT);
            await driver.get('http://localhost:3010/#/admin');
        });

        it('should display the removed resources', async () => {
            await driver.wait(until.elementLocated(By.css('.removed_resources')), DEFAULT_WAIT_TIMEOUT);
            const headers = await driver.findElements(By.css('.removed_resources table th'));
            const headersText = await Promise.all(headers.map(h => h.getText()));
            expect(headersText).toEqual(['uri', 'fullname', 'email', '']);

            const tds = await driver.findElements(By.css('.removed_resources table tbody td'));
            expect(tds.length).toEqual(8);

            const tdsText = await Promise.all(tds.map(td => td.getText()));
            expect(tdsText.some(t => t === 'PEREGRIN.TOOK')).toEqual(true);
            expect(tdsText.some(t => t === 'peregrin.took@shire.net')).toEqual(true);
            expect(tdsText.some(t => t === 'SAMSAGET.GAMGIE')).toEqual(true);
            expect(tdsText.some(t => t === 'samsaget.gamgie@shire.net')).toEqual(true);
        });

        it('should remove a resource which has been restored', async () => {
            const buttons = await driver.findElements(By.css('.btn-restore-resource'));
            await buttons[0].click();

            await driver.sleep(500);
            const tds = await driver.findElements(By.css('.removed_resources table tbody td'));
            expect(tds.length).toEqual(4);
        });

        after(async () => {
            await clear();
            await driver.executeScript('localStorage.clear();');
        });
    });
});
