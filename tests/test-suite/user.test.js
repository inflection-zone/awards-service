const request = require('supertest');
const assert = require('chai').assert;
const should = require('chai').should;
const expect = require('chai').expect;

const infra = require('../index');

///////////////////////////////////////////////////////////////////////////

describe('User tests', function() {

    var agent = request.agent(infra.app);

    it('Create user', function(done) {
        loadUserCreateModel();
        const createModel = TestCache.UserCreateModel;
        agent
            .post(`/api/v1/users/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['USER_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('UserName');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('UserRole');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');
                expect(response.body.Data).to.have.property('Password');

                expect(response.body.Data.id).to.equal(TestCache.UserCreateModel.id);
                expect(response.body.Data.UserName).to.equal(TestCache.UserCreateModel.UserName);
                expect(response.body.Data.FirstName).to.equal(TestCache.UserCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.UserCreateModel.LastName);
                expect(response.body.Data.UserRole).to.equal(TestCache.UserCreateModel.UserRole);
                expect(response.body.Data.Phone).to.equal(TestCache.UserCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.UserCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.UserCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.UserCreateModel.BirthDate);
                expect(response.body.Data.Password).to.equal(TestCache.UserCreateModel.Password);

            })
            .expect(201, done);
    });

    it('Get user by id', function(done) {
        const id = `${TestCache.USER_ID}`
        agent
            .get(`/api/v1/users/${TestCache.USER_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('UserName');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('UserRole');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');
                expect(response.body.Data).to.have.property('Password');

                expect(response.body.Data.id).to.equal(TestCache.UserCreateModel.id);
                expect(response.body.Data.UserName).to.equal(TestCache.UserCreateModel.UserName);
                expect(response.body.Data.FirstName).to.equal(TestCache.UserCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.UserCreateModel.LastName);
                expect(response.body.Data.UserRole).to.equal(TestCache.UserCreateModel.UserRole);
                expect(response.body.Data.Phone).to.equal(TestCache.UserCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.UserCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.UserCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.UserCreateModel.BirthDate);
                expect(response.body.Data.Password).to.equal(TestCache.UserCreateModel.Password);

            })
            .expect(200, done);
    });

    it('Search user records', function(done) {
        loadUserQueryString();
        const queryString = TestCache.UserQueryString;
        agent
            .get(`/api/v1/users/search${queryString}`)
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

    it('Update user', function(done) {
        loadUserUpdateModel();
        const updateModel = TestCache.UserUpdateModel;
        const id = `${TestCache.USER_ID}`
        agent
            .put(`/api/v1/users/${TestCache.USER_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .send(updateModel)
            .expect(response => {
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('UserName');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('UserRole');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');
                expect(response.body.Data).to.have.property('Password');

                expect(response.body.Data.id).to.equal(TestCache.UserCreateModel.id);
                expect(response.body.Data.UserName).to.equal(TestCache.UserCreateModel.UserName);
                expect(response.body.Data.FirstName).to.equal(TestCache.UserCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.UserCreateModel.LastName);
                expect(response.body.Data.UserRole).to.equal(TestCache.UserCreateModel.UserRole);
                expect(response.body.Data.Phone).to.equal(TestCache.UserCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.UserCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.UserCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.UserCreateModel.BirthDate);
                expect(response.body.Data.Password).to.equal(TestCache.UserCreateModel.Password);

            })
            .expect(200, done);
    });

    it('Delete user', function(done) {
        const id = `${TestCache.USER_ID}`

        //Delete
        agent
            .delete(`/api/v1/users/${TestCache.USER_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(response => {
                expect(response.body.Data).to.have.property('Deleted');
                expect(response.body.Data.Deleted).to.equal(true);
            })
            .expect(200, done);

        //Check again if exists!
        agent
            .get(`/api/v1/users/${TestCache.USER_ID}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${TestCache.AdminJwt}`)
            .expect(404, done);

        //Recreate it again because we need it again
        const createModel = TestCache.UserCreateModel;
        agent
            .post(`/api/v1/users/`)
            .set('Content-Type', 'application/json')
            .send(createModel)
            .expect(response => {
                TestCache['USER_ID'] = response.body.Data.id;
                //assert.exists(response.body.Data.Xyz, 'Xyz exists.');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('id');
                expect(response.body.Data).to.have.property('UserName');
                expect(response.body.Data).to.have.property('FirstName');
                expect(response.body.Data).to.have.property('LastName');
                expect(response.body.Data).to.have.property('UserRole');
                expect(response.body.Data).to.have.property('Phone');
                expect(response.body.Data).to.have.property('Email');
                expect(response.body.Data).to.have.property('Gender');
                expect(response.body.Data).to.have.property('BirthDate');
                expect(response.body.Data).to.have.property('Password');

                expect(response.body.Data.id).to.equal(TestCache.UserCreateModel.id);
                expect(response.body.Data.UserName).to.equal(TestCache.UserCreateModel.UserName);
                expect(response.body.Data.FirstName).to.equal(TestCache.UserCreateModel.FirstName);
                expect(response.body.Data.LastName).to.equal(TestCache.UserCreateModel.LastName);
                expect(response.body.Data.UserRole).to.equal(TestCache.UserCreateModel.UserRole);
                expect(response.body.Data.Phone).to.equal(TestCache.UserCreateModel.Phone);
                expect(response.body.Data.Email).to.equal(TestCache.UserCreateModel.Email);
                expect(response.body.Data.Gender).to.equal(TestCache.UserCreateModel.Gender);
                expect(response.body.Data.BirthDate).to.equal(TestCache.UserCreateModel.BirthDate);
                expect(response.body.Data.Password).to.equal(TestCache.UserCreateModel.Password);

            })
            .expect(201, done);
    });

});

///////////////////////////////////////////////////////////////////////////

function loadUserCreateModel() {
    const model = {
        UserName: "",
        FirstName: "John",
        LastName: "Doe",
        Gender: "Female",
        BirthDate: "",
        Password: "test@123",

    };
    TestCache.UserCreateModel = model;
}

function loadUserUpdateModel() {
    const model = {
        UserName: "",
        FirstName: "John",
        LastName: "Doe",
        Phone: "9876543210",
        Email: "john.doe@myapp.com",
        Gender: "Female",
        BirthDate: "",
        Password: "test@123",

    };
    TestCache.UserUpdateModel = model;
}

function loadUserQueryString() {
    //This is raw query. Please modify to suit the test
    const queryString = '?userName=xyz&firstName=xyz&lastName=xyz&gender=xyz&birthDate=xyz'
    return queryString;
}

///////////////////////////////////////////////////////////////////////////