
const _root = '//footer[@data-widget="footer"]';
const _locators = {
    ROOT: _root,
    VER_FOR_VIS_IMPARED: _root + '//button[contains(.,"ля слабовидящих")]',
    INFO_LINKS_SECTION: _root + '/div/div[2]/div[2]/div[1]',
    JOBS_SECTION: _root + '/div/div[1]',
    ECOSYSTEM_SECTION: _root + '/div[2]/div/div[2]'
}

export class Footer {

    static locators = _locators;

}