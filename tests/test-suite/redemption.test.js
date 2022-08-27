const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Redemption tests', function() {

    var agent = request.agent(infra.app);

    it('Create redemption', function(done) {
        loadRedemptionCreateModel();
        const createModel = TestCache.RedemptionCreateModel;
        agent
            .post(`/api/v1/redemptions/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['REDEMPTION_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RedemptionDate');
                expect(response.body.Data).to.have.property('RedemptionStatus');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.RedemptionCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.RedemptionCreateModel.ClientId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.RedemptionCreateModel.SchemeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.RedemptionCreateModel.ParticipantId);
                expect(response.body.Data.Name).to.equal(TestCache.RedemptionCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.RedemptionCreateModel.Description);
                expect(response.body.Data.RedemptionDate).to.equal(TestCache.RedemptionCreateModel.RedemptionDate);
                expect(response.body.Data.RedemptionStatus).to.equal(TestCache.RedemptionCreateModel.RedemptionStatus);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.RedemptionCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

    it('Get redemption by id', function(done) {
        const id = `${TestCache.REDEMPTION_ID}`
        agent
            .get(`/api/v1/redemptions/${TestCache.REDEMPTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RedemptionDate');
                expect(response.body.Data).to.have.property('RedemptionStatus');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.RedemptionCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.RedemptionCreateModel.ClientId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.RedemptionCreateModel.SchemeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.RedemptionCreateModel.ParticipantId);
                expect(response.body.Data.Name).to.equal(TestCache.RedemptionCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.RedemptionCreateModel.Description);
                expect(response.body.Data.RedemptionDate).to.equal(TestCache.RedemptionCreateModel.RedemptionDate);
                expect(response.body.Data.RedemptionStatus).to.equal(TestCache.RedemptionCreateModel.RedemptionStatus);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.RedemptionCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Search redemption records', function(done) {
        loadRedemptionQueryString();
        const queryString = TestCache.RedemptionQueryString;
        agent
            .get(`/api/v1/redemptions/search${queryString}`)
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

    it('Update redemption', function(done) {
        loadRedemptionUpdateModel();
        const updateModel = TestCache.RedemptionUpdateModel;
        const id = `${TestCache.REDEMPTION_ID}`
        agent
            .put(`/api/v1/redemptions/${TestCache.REDEMPTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RedemptionDate');
                expect(response.body.Data).to.have.property('RedemptionStatus');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.RedemptionCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.RedemptionCreateModel.ClientId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.RedemptionCreateModel.SchemeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.RedemptionCreateModel.ParticipantId);
                expect(response.body.Data.Name).to.equal(TestCache.RedemptionCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.RedemptionCreateModel.Description);
                expect(response.body.Data.RedemptionDate).to.equal(TestCache.RedemptionCreateModel.RedemptionDate);
                expect(response.body.Data.RedemptionStatus).to.equal(TestCache.RedemptionCreateModel.RedemptionStatus);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.RedemptionCreateModel.RootRuleNodeId);

            })
            .expect(200, done);
    });

    it('Delete redemption', function(done) {
        const id = `${TestCache.REDEMPTION_ID}`

        //Delete
        agent
            .delete(`/api/v1/redemptions/${TestCache.REDEMPTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/redemptions/${TestCache.REDEMPTION_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.RedemptionCreateModel;
        agent
            .post(`/api/v1/redemptions/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['REDEMPTION_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('ClientId');
                expect(response.body.Data).to.have.property('SchemeId');
                expect(response.body.Data).to.have.property('ParticipantId');
                expect(response.body.Data).to.have.property('Name');
                expect(response.body.Data).to.have.property('Description');
                expect(response.body.Data).to.have.property('RedemptionDate');
                expect(response.body.Data).to.have.property('RedemptionStatus');
                expect(response.body.Data).to.have.property('RootRuleNodeId');

                expect(response.body.Data.id).to.equal(TestCache.RedemptionCreateModel.id);
                expect(response.body.Data.ClientId).to.equal(TestCache.RedemptionCreateModel.ClientId);
                expect(response.body.Data.SchemeId).to.equal(TestCache.RedemptionCreateModel.SchemeId);
                expect(response.body.Data.ParticipantId).to.equal(TestCache.RedemptionCreateModel.ParticipantId);
                expect(response.body.Data.Name).to.equal(TestCache.RedemptionCreateModel.Name);
                expect(response.body.Data.Description).to.equal(TestCache.RedemptionCreateModel.Description);
                expect(response.body.Data.RedemptionDate).to.equal(TestCache.RedemptionCreateModel.RedemptionDate);
                expect(response.body.Data.RedemptionStatus).to.equal(TestCache.RedemptionCreateModel.RedemptionStatus);
                expect(response.body.Data.RootRuleNodeId).to.equal(TestCache.RedemptionCreateModel.RootRuleNodeId);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadRedemptionCreateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        SchemeId: TestCache.SCHEME_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        Name: "",
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.RedemptionCreateModel = model;
}

function loadRedemptionUpdateModel() {
    const model = {
        ClientId: TestCache.CLIENT_ID,
        SchemeId: TestCache.SCHEME_ID,
        ParticipantId: TestCache.PARTICIPANT_ID,
        Name: "",
        Description: "",
        RootRuleNodeId: TestCache.ROOT_RULE_NODE_ID,

    };
    TestCache.RedemptionUpdateModel = model;
}

function loadRedemptionQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?clientId=xyz&schemeId=xyz&participantId=xyz&name=xyz&redemptionDate=xyz&redemptionStatus=xyz&rootRuleNodeId=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////