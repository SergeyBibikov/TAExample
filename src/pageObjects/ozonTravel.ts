const searchForm = '//form[@data-widget="searchForm"]';

export class OzonTravel {
    static FROM = '//p[text()="Откуда"]/preceding-sibling::input';
    static TO = '//p[text()="Куда"]/preceding-sibling::input';
    static DATE_TO = '//p[text()="Туда"]/..';
    static DESTINATION_SWITCH = searchForm + '/div/div[2]/button';
}