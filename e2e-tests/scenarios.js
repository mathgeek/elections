'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /results when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/results");
  });


  describe('results', function() {

    beforeEach(function() {
      browser.get('index.html#!/results');
    });


    it('should render results when user navigates to /results', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/soon/);
    });

  });
});
