const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Event action tests', function() {

    var agent = request.agent(infra.app);

    it('Create event action', function(done) {
        loadEventActionCreateModel();
        const createModel = TestCache.EventActionCreateModel;
        agent
            .post(`/api/v1/event-actions/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_ACTION_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventActionTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventActionCreateModel.id);
                expect(response.body.Data.EventActionTypeId).to.equal(TestCache.EventActionCreateModel.EventActionTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventActionCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventActionCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventActionCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventActionCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

    it('Get event action by id', function(done) {
        const id = `${TestCache.EVENT_ACTION_ID}`
        agent
            .get(`/api/v1/event-actions/${TestCache.EVENT_ACTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventActionTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventActionCreateModel.id);
                expect(response.body.Data.EventActionTypeId).to.equal(TestCache.EventActionCreateModel.EventActionTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventActionCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventActionCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventActionCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventActionCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Search event action records', function(done) {
        loadEventActionQueryString();
        const queryString = TestCache.EventActionQueryString;
        agent
            .get(`/api/v1/event-actions/search${queryString}`)
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

    it('Update event action', function(done) {
        loadEventActionUpdateModel();
        const updateModel = TestCache.EventActionUpdateModel;
        const id = `${TestCache.EVENT_ACTION_ID}`
        agent
            .put(`/api/v1/event-actions/${TestCache.EVENT_ACTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventActionTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventActionCreateModel.id);
                expect(response.body.Data.EventActionTypeId).to.equal(TestCache.EventActionCreateModel.EventActionTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventActionCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventActionCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventActionCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventActionCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Delete event action', function(done) {
        const id = `${TestCache.EVENT_ACTION_ID}`

        //Delete
        agent
            .delete(`/api/v1/event-actions/${TestCache.EVENT_ACTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/event-actions/${TestCache.EVENT_ACTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.EventActionCreateModel;
        agent
            .post(`/api/v1/event-actions/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['EVENT_ACTION_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('EventActionTypeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('Timestamp');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.EventActionCreateModel.id);
                expect(response.body.Data.EventActionTypeId).to.equal(TestCache.EventActionCreateModel.EventActionTypeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.EventActionCreateModel.ParticipantId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.EventActionCreateModel.SchemeId);
                expect(response.body.Data.Timestamp).to.equal(TestCache.EventActionCreateModel.Timestamp);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.EventActionCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadEventActionCreateModel() {
    const model = {
        EventActionTypeId: TestCache.EVENT_ACTION_TYPE_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        SchemeId: TestCache.SCHEME_ID,
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventActionCreateModel = model;
}

function loadEventActionUpdateModel() {
    const model = {
        EventActionTypeId: TestCache.EVENT_ACTION_TYPE_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        SchemeId: TestCache.SCHEME_ID,
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.EventActionUpdateModel = model;
}

function loadEventActionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?eventActionTypeId=xyz&participantId=xyz&schemeId=xyz&timestamp=xyz&rootRuleNodeId=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////