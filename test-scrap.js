const Nightmare = require('nightmare');
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect
chai.use(chaiHttp)

// use for save file only
const fs = require("fs");

const baseUrl = 'https://egov.uscis.gov/cris/processTimesDisplayInit.do'
describe('Base Url Test', function () {
    this.timeout(100000);
    var nightmare = null;
    beforeEach(function () {
        nightmare = new Nightmare({
            show: false,
            webPreferences: {
                devTools: true,
                allowRunningInsecureContent: true,
                nativeWindowOpen: true
            }
        });

    })
    it("should go to other page", async function () {
        let result = [];
        let counties = ["11", "4", "15", "22", "24", "40", "41", "47", "80", "58", "55", "68", "57", "60", "443", "63", "65", "444", "83", "84", "92", "86", "100", "127", "122", "147", "160", "154", "155", "500", "156", "169", "51", "176", "180", "186", "999", "212", "1007", "207", "1010", "208", "218", "223", "228", "229", "70", "260", "272", "254", "262", "1000", "276", "278", "281", "300", "301", "308", "312", "314", "317", "1009", "995", "329", "339", "377", "379", "372", "360", "363", "346", "364", "1008", "356", "365", "341", "338", "353", "373", "387", "398", "411", "422", "418", "426"];
        for (let off of counties) {

            let ret = await nightmare.goto(baseUrl)
                //.click('#content > table > tbody > tr:nth-child(2) > td:nth-child(4) > input[type="submit"]')
                .select('#officeSelect', off)
                .click('input[name="displayLOProcTimes"]')
                .wait('#ptResults > caption > b:nth-child(2)')
                .evaluate(() => {
                    return {
                        "office": document.querySelector('#ptResults > caption > b:nth-child(1)').innerText,
                        "time": document.querySelector('#ptResults > tbody > tr.even > td:nth-child(3)').innerText.trim()
                    }
                });
            result.push(ret);
        };

        var json = JSON.stringify(result);
        fs.writeFile('all_city.json', json, (err) => {
            console.log("2222 ", __dirname);
            if (err) {
                expect(err).to.eq(null);
            }
            nightmare.end();
        })
        console.log(__dirname);
        expect(result[0].time).to.equal('October 20, 2016');
        expect(result[0].office).to.equal('Agana GU');
        // nightmare.end();
    })
});