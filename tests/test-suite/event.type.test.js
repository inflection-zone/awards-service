const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Event type tests', function() {

    var agent = request.agent(infra.app);

    it('Create event type', function(done) {
        loadEventTypeCreateModel();
        const createModel = TestCache.EventTypeCreateModel;
        agent
            .post(`/api/v1/event-types/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_TYPE_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventTypeCreateModel.id);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventTypeCreateModel.SchemeId);
                expect(response.body.Data.ClientId).to.equal(TestCache.EventTypeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.EventTypeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.EventTypeCreateModel.Description);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventTypeCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

    it('Get event type by id', function(done) {
        const id = `${TestCache.EVENT_TYPE_ID}`
        agent
            .get(`/api/v1/event-types/${TestCache.EVENT_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventTypeCreateModel.id);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventTypeCreateModel.SchemeId);
                expect(response.body.Data.ClientId).to.equal(TestCache.EventTypeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.EventTypeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.EventTypeCreateModel.Description);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventTypeCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Search event type records', function(done) {
        loadEventTypeQueryString();
        const queryString = TestCache.EventTypeQueryString;
        agent
            .get(`/api/v1/event-types/search${queryString}`)
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

    it('Update event type', function(done) {
        loadEventTypeUpdateModel();
        const updateModel = TestCache.EventTypeUpdateModel;
        const id = `${TestCache.EVENT_TYPE_ID}`
        agent
            .put(`/api/v1/event-types/${TestCache.EVENT_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventTypeCreateModel.id);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventTypeCreateModel.SchemeId);
                expect(response.body.Data.ClientId).to.equal(TestCache.EventTypeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.EventTypeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.EventTypeCreateModel.Description);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventTypeCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Delete event type', function(done) {
        const id = `${TestCache.EVENT_TYPE_ID}`

        //Delete
        agent
            .delete(`/api/v1/event-types/${TestCache.EVENT_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/event-types/${TestCache.EVENT_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.EventTypeCreateModel;
        agent
            .post(`/api/v1/event-types/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_TYPE_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventTypeCreateModel.id);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventTypeCreateModel.SchemeId);
                expect(response.body.Data.ClientId).to.equal(TestCache.EventTypeCreateModel.ClientId);
                expect(response.body.Data.Name).to.equal(TestCache.EventTypeCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.EventTypeCreateModel.Description);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventTypeCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadEventTypeCreateModel() {
    const model = {
        SchemeId: TestCache.SCHEME_ID,
        ClientId: TestCache.CLIENT_ID,
        Name: "",
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventTypeCreateModel = model;
}

function loadEventTypeUpdateModel() {
    const model = {
        SchemeId: TestCache.SCHEME_ID,
        ClientId: TestCache.CLIENT_ID,
        Name: "",
        Description: "",
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventTypeUpdateModel = model;
}

function loadEventTypeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?schemeId=xyz&clientId=xyz&name=xyz&rootRuleNodeId=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////