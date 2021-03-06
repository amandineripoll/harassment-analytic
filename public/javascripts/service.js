import { Country } from './country.js';

export const getYears = () => ["2015", "2016", "2017", "2018", "2019"];
export const getCountries = () => {
    let tab = [];
    tab.push(new Country("FR", "France", {"edition": "fr-fr","word": "harcèlement" }, []));
    tab.push(new Country("US", "New York", {"edition": "en-us-ny","word" : "harassment" }, []));
    tab.push(new Country("US", "San Francisco", {"edition": "en-us-df","word" : "harassment" }, []));
    tab.push(new Country("GB", "United Kingdom", {"edition": "en-gb","word": "harassment" }, []));
    tab.push(new Country("BE", "Belgium FR", {"edition": "fr-be","word": "harcèlement" }, []));
    tab.push(new Country("BE", "Belgium NL", {"edition": "nl-be","word": "intimidatie" }, []));
    tab.push(new Country("DE", "Germany", {"edition": "de-de","word": "Belästigung" }, []));
    tab.push(new Country("IT", "Italy", {"edition": "it-it","word": "molestia" }, []));
    return tab;
}

const tabCountries = getCountries();
const tabYears = getYears();

export const getInformationsYear = (year) => {
    return new Promise(function(resolve, reject) {
        var cpt = 0;
        // boucle sur la tabCountries pour faire une recherche d'edition par pays (=country)
        for (let j = 0; j < tabCountries.length; j++) {
            let request = new XMLHttpRequest();
            request.open('GET', 'https://api.ozae.com/gnw/articles?date='+year+'0101__'+year+'1231&edition='+tabCountries[j].tabTranslation['edition']+'&query='+tabCountries[j].tabTranslation['word']+'&key=646c7b6710c14533be68450f2d61d15d', true)
            request.onload = function() {
                let data = JSON.parse(this.response);
                console.log(data);
                if (request.status >= 200 && request.status < 400) {
                    tabCountries[j].tabArticles = data['articles'];
                    cpt++;
                    if(cpt == tabCountries.length) {
                        console.log("chargement terminé");
                        resolve(tabCountries);
                    }
                } else {
                    reject('error');
                }
            }
            request.send();
        }
    });
}

export const getInformationsPeriod = (dateStart, dateEnd) => {
    return new Promise(function(resolve, reject) {
        var cpt = 0;
        for (let i = 0; i < tabCountries.length; i++) {
            let request = new XMLHttpRequest();
            request.open('GET', 'https://api.ozae.com/gnw/articles?date='+dateStart+'__'+dateEnd+'&edition='+tabCountries[i].tabTranslation['edition']+'&query='+tabCountries[i].tabTranslation['word']+'&key=646c7b6710c14533be68450f2d61d15d', true)
            request.onload = function() {
                let data = JSON.parse(this.response);
                if (request.status >= 200 && request.status < 400) {
                    tabCountries[i].tabArticles = data;
                    cpt++;
                    if(cpt == tabCountries.length) {
                        resolve(tabCountries);
                    }
                } else {
                    reject('error');
                }
            }
            request.send();
        }
      });
}

export const getInformationsArticles = (dateStart, dateEnd, limit) => {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://api.ozae.com/gnw/articles?date='+dateStart+'__'+dateEnd+'&edition=fr-fr&query=harcèlement&order[col]=social_score&order[srt]=DESC&hard_limit='+limit+'&key=646c7b6710c14533be68450f2d61d15d', true)
        request.onload = function() {
            let data = JSON.parse(this.response);
            if (request.status >= 200 && request.status < 400) {
                resolve(data);
            } else {
                reject('error');
            }
        }
        request.send();
    });
}

export const getInformationsStats = () => {
    return new Promise(function(resolve, reject) {
        var cpt = 0;
        // boucle sur la tabYears pour rechercher sur toutes les années
        for (let i = 0; i < tabYears.length; i++) {
            // boucle sur la tabCountries pour faire une recherche d'edition par pays (=country)
            for (let j = 0; j < tabCountries.length; j++) {
                let request = new XMLHttpRequest();
                request.open('GET', 'https://api.ozae.com/gnw/articles?date='+tabYears[i]+'0101__'+tabYears[i]+'1231&edition='+tabCountries[j].tabTranslation['edition']+'&query='+tabCountries[j].tabTranslation['word']+'&key=646c7b6710c14533be68450f2d61d15d', true)
                request.onload = function() {
                    let data = JSON.parse(this.response);
                    if (request.status >= 200 && request.status < 400) {
                        tabCountries[j].tabArticles.push({ "year": tabYears[i], "count": data['articles'].length }) ;
                        cpt++;
                        if(cpt == tabCountries.length * tabYears.length) {
                            resolve(tabCountries);
                        }
                    } else {
                        reject('error');
                    }
                }
                request.send();
            }
        }
    });
}
