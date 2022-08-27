const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Event tests', function() {

    var agent = request.agent(infra.app);

    it('Create event', function(done) {
        loadEventCreateModel();
        const createModel = TestCache.EventCreateModel;
        agent
            .post(`/api/v1/events/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventCreateModel.id);
                expect(response.body.Data.EventTypeId).to.equal(TestCache.EventCreateModel.EventTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

    it('Get event by id', function(done) {
        const id = `${TestCache.EVENT_ID}`
        agent
            .get(`/api/v1/events/${TestCache.EVENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventCreateModel.id);
                expect(response.body.Data.EventTypeId).to.equal(TestCache.EventCreateModel.EventTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Search event records', function(done) {
        loadEventQueryString();
        const queryString = TestCache.EventQueryString;
        agent
            .get(`/api/v1/events/search${queryString}`)
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

    it('Update event', function(done) {
        loadEventUpdateModel();
        const updateModel = TestCache.EventUpdateModel;
        const id = `${TestCache.EVENT_ID}`
        agent
            .put(`/api/v1/events/${TestCache.EVENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventCreateModel.id);
                expect(response.body.Data.EventTypeId).to.equal(TestCache.EventCreateModel.EventTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Delete event', function(done) {
        const id = `${TestCache.EVENT_ID}`

        //Delete
        agent
            .delete(`/api/v1/events/${TestCache.EVENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/events/${TestCache.EVENT_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.EventCreateModel;
        agent
            .post(`/api/v1/events/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventCreateModel.id);
                expect(response.body.Data.EventTypeId).to.equal(TestCache.EventCreateModel.EventTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadEventCreateModel() {
    const model = {
        EventTypeId: TestCache.EVENT_TYPE_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        SchemeId: TestCache.SCHEME_ID,
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventCreateModel = model;
}

function loadEventUpdateModel() {
    const model = {
        EventTypeId: TestCache.EVENT_TYPE_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        SchemeId: TestCache.SCHEME_ID,
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventUpdateModel = model;
}

function loadEventQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?eventTypeId=xyz&participantId=xyz&schemeId=xyz&timestamp=xyz&rootRuleNodeId=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////