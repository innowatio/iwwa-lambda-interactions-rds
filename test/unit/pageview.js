import {expect} from "chai";

import {getDeviceName} from "cases/pageview";


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
