const fs = require('fs');
const path = require('path');
const chai = require('chai');
const nock = require('nock');
const expect = chai.expect;

const defraAirQuality = require('../app');

const demoXml = fs
  .readFileSync(path.resolve(__dirname, './defra.xml'))
  .toString();

const createNock = response =>
  nock('https://uk-air.defra.gov.uk')
    .get('/assets/rss/current_site_levels.xml')
    .reply(200, response);

describe('app', () => {
  describe('#list()', () => {
    it('should throw if invalid XML is returned from DEFRA', () => {
      const server = createNock('Invalid XML');

      return defraAirQuality.list().catch(err => {
        expect(err).to.exist;
        expect(err).to.be.instanceof(Error);
        expect(err).to.have.property(
          'message',
          'Unable to process DEFRA data, please try again'
        );

        nock.removeInterceptor(server);
      });
    });

    it('should return an array of the results', () => {
      createNock(demoXml);

      return defraAirQuality.list().then(data => {
        expect(data).to.be.an('array');
        expect(data.length).to.equal(11);
      });
    });

    it('should return array items of the correct object structure', () => {
      createNock(demoXml);

      return defraAirQuality.list().then(data => {
        const record = data[0];

        expect(record).to.be.an('object');
        expect(record.title).to.be.a('string');
        expect(record.link).to.be.a('string');
        expect(record.location).to.be.an('object');
        expect(record.location.dms).to.be.a('string');
        expect(record.location.latitude).to.be.a('number');
        expect(record.location.latitude).to.be.a('number');
        expect(record.description).to.be.a('string');
        expect(record.level).to.be.a('string');
        expect(record.index).to.be.a('string');
      });
    });

    it('should return the correct array item values', () => {
      createNock(demoXml);

      return defraAirQuality.list().then(data => {
        const record = data[0];

        expect(record.title).to.equal('Auchencorth Moss');
        expect(record.link).to.equal(
          'http://uk-air.defra.gov.uk/data/site-data?f_site_id=ACTH&view=last_hour'
        );
        expect(record.location.dms).to.equal('55°47´31.78"N 3°14´34.44"W');
        expect(record.location.latitude).to.equal(55.792161);
        expect(record.location.longitude).to.equal(-3.2429);
        expect(record.description).to.equal(
          'Current Pollution level is Low at index 3'
        );
        expect(record.level).to.equal('Low');
        expect(record.index).to.equal('3');
      });
    });
  });

  describe('#findByName()', () => {
    it('should throw if no name is provided', () => {
      expect(() => defraAirQuality.findByName()).to.throw(
        Error,
        /Please provide a name/
      );
    });

    it('should return an object with the correct structure', () => {
      createNock(demoXml);

      return defraAirQuality.findByName('Auchencorth Moss').then(record => {
        expect(record).to.be.an('object');
        expect(record.title).to.be.a('string');
        expect(record.link).to.be.a('string');
        expect(record.location).to.be.an('object');
        expect(record.location.dms).to.be.a('string');
        expect(record.location.latitude).to.be.a('number');
        expect(record.location.latitude).to.be.a('number');
        expect(record.description).to.be.a('string');
        expect(record.level).to.be.a('string');
        expect(record.index).to.be.a('string');
      });
    });

    it('should return the matching record', () => {
      createNock(demoXml);

      return defraAirQuality.findByName('Auchencorth Moss').then(record => {
        expect(record.title).to.equal('Auchencorth Moss');
        expect(record.link).to.equal(
          'http://uk-air.defra.gov.uk/data/site-data?f_site_id=ACTH&view=last_hour'
        );
        expect(record.location.dms).to.equal('55°47´31.78"N 3°14´34.44"W');
        expect(record.location.latitude).to.equal(55.792161);
        expect(record.location.longitude).to.equal(-3.2429);
        expect(record.description).to.equal(
          'Current Pollution level is Low at index 3'
        );
        expect(record.level).to.equal('Low');
        expect(record.index).to.equal('3');
      });
    });

    it('should not include level and index if the DEFRA data does not contain this information', () => {
      createNock(demoXml);

      return defraAirQuality
        .findByName('Chesterfield Loundsley Green')
        .then(record => {
          expect(record.title).to.equal('Chesterfield Loundsley Green');
          expect(record.description).to.equal('Current Pollution level is n/a');
          expect(record.level).to.be.undefined;
          expect(record.index).to.be.undefined;
        });
    });
  });

  describe('#findByNearestLocation()', () => {
    it('should throw if no latitude or longitude is provided', () => {
      expect(() => defraAirQuality.findByNearestLocation()).to.throw(
        Error,
        /Please provide a latitude/
      );

      expect(() => defraAirQuality.findByNearestLocation(1)).to.throw(
        Error,
        /Please provide a longitude/
      );
    });

    it('should return an object with the correct structure', () => {
      createNock(demoXml);

      return defraAirQuality
        .findByNearestLocation(55.792160, -3.242900)
        .then(record => {
          expect(record).to.be.an('object');
          expect(record.title).to.be.a('string');
          expect(record.link).to.be.a('string');
          expect(record.location).to.be.an('object');
          expect(record.location.dms).to.be.a('string');
          expect(record.location.latitude).to.be.a('number');
          expect(record.location.latitude).to.be.a('number');
          expect(record.description).to.be.a('string');
          expect(record.level).to.be.a('string');
          expect(record.index).to.be.a('string');
        });
    });

    it('should return the correct record', () => {
      createNock(demoXml);

      return defraAirQuality
        .findByNearestLocation(55.792160, -3.242900)
        .then(record => {
          expect(record.title).to.equal('Auchencorth Moss');
          expect(record.link).to.equal(
            'http://uk-air.defra.gov.uk/data/site-data?f_site_id=ACTH&view=last_hour'
          );
          expect(record.location.dms).to.equal('55°47´31.78"N 3°14´34.44"W');
          expect(record.location.latitude).to.equal(55.792161);
          expect(record.location.longitude).to.equal(-3.2429);
          expect(record.description).to.equal(
            'Current Pollution level is Low at index 3'
          );
          expect(record.level).to.equal('Low');
          expect(record.index).to.equal('3');
        });
    });
  });
});
