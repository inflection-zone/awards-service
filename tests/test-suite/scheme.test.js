const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Scheme tests', function() {

    var agent = request.agent(infra.app);

    it('Create scheme', function(done) {
        loadSchemeCreateModel();
        const createModel = TestCache.SchemeCreateModel;
        agent
            .post(`/api/v1/schemes/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['SCHEME_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('ValidFrom');
                expect(response.body.Data).to.have.property('ValidTill');

                expect(response.body.Data.id).to.equal(TestCache.SchemeCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.SchemeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.SchemeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.SchemeCreateModel.Description);
                expect(response.body.Data.ValidFrom).to.equal(TestCache.SchemeCreateModel.ValidFrom);
                expect(response.body.Data.ValidTill).to.equal(TestCache.SchemeCreateModel.ValidTill);

            })
            .expect(201, done);
    });

    it('Get scheme by id', function(done) {
        const id = `${TestCache.SCHEME_ID}`
        agent
            .get(`/api/v1/schemes/${TestCache.SCHEME_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('ValidFrom');
                expect(response.body.Data).to.have.property('ValidTill');

                expect(response.body.Data.id).to.equal(TestCache.SchemeCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.SchemeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.SchemeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.SchemeCreateModel.Description);
                expect(response.body.Data.ValidFrom).to.equal(TestCache.SchemeCreateModel.ValidFrom);
                expect(response.body.Data.ValidTill).to.equal(TestCache.SchemeCreateModel.ValidTill);

            })
            .expect(200, done);
    });

    it('Search scheme records', function(done) {
        loadSchemeQueryString();
        const queryString = TestCache.SchemeQueryString;
        agent
            .get(`/api/v1/schemes/search${queryString}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('TotalCount');
                expect(response.body.Data).to.have.property('RetrievedCount');
                expect(response.body.Data).to.have.property('PageIndex');
                expect(response.body.Data).to.have.property('ItemsPerPage');
                expect(response.body.Data).to.have.property('Order');
                expect(response.body.Data).to.have.property('OrderedBy');
                expect(response.body.Data.TotalCount).to.greaterThan(0);
                expect(response.body.Data.RetrievedCount).to.greaterThan(0);
                expect(response.body.Data.Items.length).to.greaterThan(0);
            })
            .expect(200, done);
    });

    it('Update scheme', function(done) {
        loadSchemeUpdateModel();
        const updateModel = TestCache.SchemeUpdateModel;
        const id = `${TestCache.SCHEME_ID}`
        agent
            .put(`/api/v1/schemes/${TestCache.SCHEME_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('ValidFrom');
                expect(response.body.Data).to.have.property('ValidTill');

                expect(response.body.Data.id).to.equal(TestCache.SchemeCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.SchemeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.SchemeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.SchemeCreateModel.Description);
                expect(response.body.Data.ValidFrom).to.equal(TestCache.SchemeCreateModel.ValidFrom);
                expect(response.body.Data.ValidTill).to.equal(TestCache.SchemeCreateModel.ValidTill);

            })
            .expect(200, done);
    });

    it('Delete scheme', function(done) {
        const id = `${TestCache.SCHEME_ID}`

        //Delete
        agent
            .delete(`/api/v1/schemes/${TestCache.SCHEME_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/schemes/${TestCache.SCHEME_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.SchemeCreateModel;
        agent
            .post(`/api/v1/schemes/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['SCHEME_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('ValidFrom');
                expect(response.body.Data).to.have.property('ValidTill');

                expect(response.body.Data.id).to.equal(TestCache.SchemeCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.SchemeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.SchemeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.SchemeCreateModel.Description);
                expect(response.body.Data.ValidFrom).to.equal(TestCache.SchemeCreateModel.ValidFrom);
                expect(response.body.Data.ValidTill).to.equal(TestCache.SchemeCreateModel.ValidTill);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadSchemeCreateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        Name: "",

    };
    TestCache.SchemeCreateModel = model;
}

function loadSchemeUpdateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        Name: "",
        Description: "",

    };
    TestCache.SchemeUpdateModel = model;
}

function loadSchemeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientId=xyz&name=xyz&validFrom=xyz&validTill=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////