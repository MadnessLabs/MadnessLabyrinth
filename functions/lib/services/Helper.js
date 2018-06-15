"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class HelperService {
    constructor(config = {}) {
        this.config = config;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    dynamicSort(property) {
        let props = property;
        let sortOrder = 1;
        if (props[0] === "-") {
            sortOrder = -1;
            props = props.substr(1);
        }
        return function (a, b) {
            const result = a[props] < b[props] ? -1 : a[props] > b[props] ? 1 : 0;
            return result * sortOrder;
        };
    }
    dynamicSortMultiple() {
        /*
         * save the arguments object as it will be overwritten
         * note that arguments object is an array-like object
         * consisting of the names of the properties to sort by
         */
        const props = arguments;
        return function (obj1, obj2) {
            let i = 0, result = 0;
            const numberOfProperties = props.length;
            /* try getting a different result from 0 (equal)
             * as long as we have extra properties to compare
             */
            while (result === 0 && i < numberOfProperties) {
                result = this.dynamicSort(props[i])(obj1, obj2);
                i++;
            }
            return result;
        };
    }
    sortByKey(array, key) {
        return array.sort(this.dynamicSort(key));
    }
    geolocationFromAddress(query) {
        try {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query.replace(/ /g, "+")}&key=${this.config("GOOGLEMAPS_KEY")}`;
                https.get(url, res => {
                    res.setEncoding("utf8");
                    let body = "";
                    res.on("data", data => {
                        body += data;
                    });
                    res.on("end", () => {
                        resolve(JSON.parse(body));
                    });
                });
            }));
        }
        catch (error) {
            throw new Error(error);
        }
    }
    getWeekNumber(dateObject) {
        // Copy date so don't modify original
        const d = new Date(+dateObject);
        d.setHours(0, 0, 0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        // Get first day of year
        const yearStart = new Date(d.getFullYear(), 0, 1);
        // Calculate full weeks to nearest Thursday
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        // Return array of year and week number
        return weekNo;
    }
    weeksInYear(year) {
        const d = new Date(year, 11, 31);
        const week = this.getWeekNumber(d);
        return week === 1 ? this.getWeekNumber(d.setDate(24)) : week;
    }
}
exports.HelperService = HelperService;
//# sourceMappingURL=Helper.js.map