import {expect} from "chai";

import {getDeviceName, getApplicationName} from "cases/pageview";


describe("`getDeviceName`", () => {

    it("returns the correct value if details are given", () => {
        expect("Android").to.equal(getDeviceName({
            platform: "Android"
        }));

        expect("6.0").to.equal(getDeviceName({
            version: "6.0"
        }));

        expect("Android 6.0").to.equal(getDeviceName({
            platform: "Android",
            version: "6.0"
        }));
    });

    it("returns empty string if details are missing", () => {
        expect("").to.equal(getDeviceName(null));
        expect("").to.equal(getDeviceName(undefined));
        expect("").to.equal(getDeviceName({}));
    });
});

describe("`getApplicationName`", () => {

    it("returns the correct value if details are given", () => {
        expect("com.my.app").to.equal(getApplicationName({
            bundle: "com.my.app"
        }));

        expect("1.0.1").to.equal(getApplicationName({
            appVersion: "1.0.1"
        }));

        expect("com.my.app 1.0.1").to.equal(getApplicationName({
            bundle: "com.my.app",
            appVersion: "1.0.1"
        }));
    });

    it("returns empty string if details are missing", () => {
        expect("").to.equal(getApplicationName(null));
        expect("").to.equal(getApplicationName(undefined));
        expect("").to.equal(getApplicationName({}));
    });
});
