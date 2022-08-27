const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('Rule node operation type tests', function() {

    var agent = request.agent(infra.app);

    it('Create rule node operation type', function(done) {
        loadRuleNodeOperationTypeCreateModel();
        const createModel = TestCache.RuleNodeOperationTypeCreateModel;
        agent
            .post(`/api/v1/rule-node-operation-types/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['RULE_NODE_OPERATION_TYPE_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Composition');
                expect(response.body.Data).to.have.property('Logical');
                expect(response.body.Data).to.have.property('Mathematical');

                expect(response.body.Data.Composition).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Composition);
                expect(response.body.Data.Logical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Logical);
                expect(response.body.Data.Mathematical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Mathematical);

            })
            .expect(201, done);
    });

    it('Get rule node operation type by id', function(done) {
        const id = `${TestCache.RULE_NODE_OPERATION_TYPE_ID}`
        agent
            .get(`/api/v1/rule-node-operation-types/${TestCache.RULE_NODE_OPERATION_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Composition');
                expect(response.body.Data).to.have.property('Logical');
                expect(response.body.Data).to.have.property('Mathematical');

                expect(response.body.Data.Composition).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Composition);
                expect(response.body.Data.Logical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Logical);
                expect(response.body.Data.Mathematical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Mathematical);

            })
            .expect(200, done);
    });

    it('Search rule node operation type records', function(done) {
        loadRuleNodeOperationTypeQueryString();
        const queryString = TestCache.RuleNodeOperationTypeQueryString;
        agent
            .get(`/api/v1/rule-node-operation-types/search${queryString}`)
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

    it('Update rule node operation type', function(done) {
        loadRuleNodeOperationTypeUpdateModel();
        const updateModel = TestCache.RuleNodeOperationTypeUpdateModel;
        const id = `${TestCache.RULE_NODE_OPERATION_TYPE_ID}`
        agent
            .put(`/api/v1/rule-node-operation-types/${TestCache.RULE_NODE_OPERATION_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('Composition');
                expect(response.body.Data).to.have.property('Logical');
                expect(response.body.Data).to.have.property('Mathematical');

                expect(response.body.Data.Composition).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Composition);
                expect(response.body.Data.Logical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Logical);
                expect(response.body.Data.Mathematical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Mathematical);

            })
            .expect(200, done);
    });

    it('Delete rule node operation type', function(done) {
        const id = `${TestCache.RULE_NODE_OPERATION_TYPE_ID}`

        //Delete
        agent
            .delete(`/api/v1/rule-node-operation-types/${TestCache.RULE_NODE_OPERATION_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/rule-node-operation-types/${TestCache.RULE_NODE_OPERATION_TYPE_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.RuleNodeOperationTypeCreateModel;
        agent
            .post(`/api/v1/rule-node-operation-types/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['RULE_NODE_OPERATION_TYPE_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('Composition');
                expect(response.body.Data).to.have.property('Logical');
                expect(response.body.Data).to.have.property('Mathematical');

                expect(response.body.Data.Composition).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Composition);
                expect(response.body.Data.Logical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Logical);
                expect(response.body.Data.Mathematical).to.equal(TestCache.RuleNodeOperationTypeCreateModel.Mathematical);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadRuleNodeOperationTypeCreateModel() {
    const model = {
        Composition: "",
        Logical: "",
        Mathematical: "",

    };
    TestCache.RuleNodeOperationTypeCreateModel = model;
}

function loadRuleNodeOperationTypeUpdateModel() {
    const model = {
        Composition: "",
        Logical: "",
        Mathematical: "",

    };
    TestCache.RuleNodeOperationTypeUpdateModel = model;
}

function loadRuleNodeOperationTypeQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?composition=xyz&logical=xyz&mathematical=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////