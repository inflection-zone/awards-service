const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Participant tests', function() {

    var agent = request.agent(infra.app);

    it('Create participant', function(done) {
        loadParticipantCreateModel();
        const createModel = TestCache.ParticipantCreateModel;
        agent
            .post(`/api/v1/participants/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['PARTICIPANT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');

                expect(response.body.Data.id).to.equal(TestCache.ParticipantCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.ParticipantCreateModel.ClientId);
                expect(response.body.Data.FirstName).to.equal(TestCache.ParticipantCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.ParticipantCreateModel.LastName);
                expect(response.body.Data.Phone).to.equal(TestCache.ParticipantCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ParticipantCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.ParticipantCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.ParticipantCreateModel.BirthDate);

            })
            .expect(201, done);
    });

    it('Get participant by id', function(done) {
        const id = `${TestCache.PARTICIPANT_ID}`
        agent
            .get(`/api/v1/participants/${TestCache.PARTICIPANT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');

                expect(response.body.Data.id).to.equal(TestCache.ParticipantCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.ParticipantCreateModel.ClientId);
                expect(response.body.Data.FirstName).to.equal(TestCache.ParticipantCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.ParticipantCreateModel.LastName);
                expect(response.body.Data.Phone).to.equal(TestCache.ParticipantCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ParticipantCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.ParticipantCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.ParticipantCreateModel.BirthDate);

            })
            .expect(200, done);
    });

    it('Search participant records', function(done) {
        loadParticipantQueryString();
        const queryString = TestCache.ParticipantQueryString;
        agent
            .get(`/api/v1/participants/search${queryString}`)
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

    it('Update participant', function(done) {
        loadParticipantUpdateModel();
        const updateModel = TestCache.ParticipantUpdateModel;
        const id = `${TestCache.PARTICIPANT_ID}`
        agent
            .put(`/api/v1/participants/${TestCache.PARTICIPANT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');

                expect(response.body.Data.id).to.equal(TestCache.ParticipantCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.ParticipantCreateModel.ClientId);
                expect(response.body.Data.FirstName).to.equal(TestCache.ParticipantCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.ParticipantCreateModel.LastName);
                expect(response.body.Data.Phone).to.equal(TestCache.ParticipantCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ParticipantCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.ParticipantCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.ParticipantCreateModel.BirthDate);

            })
            .expect(200, done);
    });

    it('Delete participant', function(done) {
        const id = `${TestCache.PARTICIPANT_ID}`

        //Delete
        agent
            .delete(`/api/v1/participants/${TestCache.PARTICIPANT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/participants/${TestCache.PARTICIPANT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.ParticipantCreateModel;
        agent
            .post(`/api/v1/participants/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['PARTICIPANT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');

                expect(response.body.Data.id).to.equal(TestCache.ParticipantCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.ParticipantCreateModel.ClientId);
                expect(response.body.Data.FirstName).to.equal(TestCache.ParticipantCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.ParticipantCreateModel.LastName);
                expect(response.body.Data.Phone).to.equal(TestCache.ParticipantCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.ParticipantCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.ParticipantCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.ParticipantCreateModel.BirthDate);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadParticipantCreateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        FirstName: "John",
        LastName: "Doe",
        Gender: "Female",
        BirthDate: "",

    };
    TestCache.ParticipantCreateModel = model;
}

function loadParticipantUpdateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        FirstName: "John",
        LastName: "Doe",
        Phone: "9876543210",
        Email: "john.doe@myapp.com",
        Gender: "Female",
        BirthDate: "",

    };
    TestCache.ParticipantUpdateModel = model;
}

function loadParticipantQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientId=xyz&firstName=xyz&lastName=xyz&gender=xyz&birthDate=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////