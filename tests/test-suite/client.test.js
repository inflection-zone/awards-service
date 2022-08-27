const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Client tests', function() {

    var agent = request.agent(infra.app);

    it('Create client', function(done) {
        loadClientCreateModel();
        const createModel = TestCache.ClientCreateModel;
        agent
            .post(`/api/v1/clients/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['CLIENT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientName');
                expect(response.body.Data).to.have.property('ClientCode');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');

                expect(response.body.Data.id).to.equal(TestCache.ClientCreateModel.id);
                expect(response.body.Data.ClientName).to.equal(TestCache.ClientCreateModel.ClientName);
                expect(response.body.Data.ClientCode).to.equal(TestCache.ClientCreateModel.ClientCode);
                expect(response.body.Data.Phone).to.equal(TestCache.ClientCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ClientCreateModel.Email);

            })
            .expect(201, done);
    });

    it('Get client by id', function(done) {
        const id = `${TestCache.CLIENT_ID}`
        agent
            .get(`/api/v1/clients/${TestCache.CLIENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientName');
                expect(response.body.Data).to.have.property('ClientCode');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');

                expect(response.body.Data.id).to.equal(TestCache.ClientCreateModel.id);
                expect(response.body.Data.ClientName).to.equal(TestCache.ClientCreateModel.ClientName);
                expect(response.body.Data.ClientCode).to.equal(TestCache.ClientCreateModel.ClientCode);
                expect(response.body.Data.Phone).to.equal(TestCache.ClientCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ClientCreateModel.Email);

            })
            .expect(200, done);
    });

    it('Search client records', function(done) {
        loadClientQueryString();
        const queryString = TestCache.ClientQueryString;
        agent
            .get(`/api/v1/clients/search${queryString}`)
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

    it('Update client', function(done) {
        loadClientUpdateModel();
        const updateModel = TestCache.ClientUpdateModel;
        const id = `${TestCache.CLIENT_ID}`
        agent
            .put(`/api/v1/clients/${TestCache.CLIENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientName');
                expect(response.body.Data).to.have.property('ClientCode');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');

                expect(response.body.Data.id).to.equal(TestCache.ClientCreateModel.id);
                expect(response.body.Data.ClientName).to.equal(TestCache.ClientCreateModel.ClientName);
                expect(response.body.Data.ClientCode).to.equal(TestCache.ClientCreateModel.ClientCode);
                expect(response.body.Data.Phone).to.equal(TestCache.ClientCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ClientCreateModel.Email);

            })
            .expect(200, done);
    });

    it('Delete client', function(done) {
        const id = `${TestCache.CLIENT_ID}`

        //Delete
        agent
            .delete(`/api/v1/clients/${TestCache.CLIENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/clients/${TestCache.CLIENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.ClientCreateModel;
        agent
            .post(`/api/v1/clients/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['CLIENT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientName');
                expect(response.body.Data).to.have.property('ClientCode');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');

                expect(response.body.Data.id).to.equal(TestCache.ClientCreateModel.id);
                expect(response.body.Data.ClientName).to.equal(TestCache.ClientCreateModel.ClientName);
                expect(response.body.Data.ClientCode).to.equal(TestCache.ClientCreateModel.ClientCode);
                expect(response.body.Data.Phone).to.equal(TestCache.ClientCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ClientCreateModel.Email);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadClientCreateModel() {
    const model = {
        ClientName: "Deepak Kumar Jain",

    };
    TestCache.ClientCreateModel = model;
}

function loadClientUpdateModel() {
    const model = {
        ClientName: "Deepak Kumar Jain",
        ClientCode: "BC456767",
        Phone: "9876543210",
        Email: "john.doe@myapp.com",

    };
    TestCache.ClientUpdateModel = model;
}

function loadClientQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientName=xyz&clientCode=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////