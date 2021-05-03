const { expect } = require('chai');
const axios = require('axios');

const businessOwnerEmail = "dashausroma@gmail.com";
const usersPassword = "123456789";
const newUserEmail = "dashamag@rambler.ru";
const newUserFirstName = "New";
const newUserLastName = "User";
const adminEmail = "dashamag@bk.ru";
const baseUrlKompot = "http://localhost:5000";
let adminToken;
let userId;
let userName;

describe('API tests for registration and login pages', function () {

it('Get Admin token', () => {
    return axios({
        method: 'POST',
        url: `${baseUrlKompot}/user/login`,
        data: {
            "email": adminEmail,
            "password": usersPassword
        }
    })
        .then(res => {
            adminToken = res.data.token;
    })
})

it('Test 1 - Should login with existing credentials',  () => {

    return axios({
        method: 'POST',
        url: `${baseUrlKompot}/user/login`,
        data: {
            "email": businessOwnerEmail,
            "password": usersPassword
        }
    })

        .then(res => {
            expect(res.status).eq(200);
            expect(res.data.message).eq('Auth success');
        })

});

it('Test 2 - Should registered New User with proper credentials',  () => {

    return axios({
        method: 'POST',
        url: `${baseUrlKompot}/user`,
        data: {
            "email": newUserEmail,
            "password": usersPassword,
            "firstName": newUserFirstName,
            "lastName": newUserLastName,
            "phone": "123456789"
        }
    })

        .then(res => {
            expect(res.status).eq(201);
            expect(res.data.message).eq('User created successfully. Please check your email and verify it');
        })

});

it('Login New User to get ID and Name',  () => {

    return axios({
        method: 'POST',
        url: `${baseUrlKompot}/user/login`,
        data: {
            "email": newUserEmail,
            "password": usersPassword
        }
    })
        .then(res => {
            userId = res.data.user._id;
            userName = res.data.user.name;
        })

});

it('Test 3 - Should check if New User was created by ID',  () => {

    return axios({
        method: 'GET',
        url: `${baseUrlKompot}/user/${userId}`,
        headers: {
            Authorization: `${adminToken}`
        }
    })
        .then(res => {
            expect(res.status).eq(200);
            expect(res.data.message).eq('User found');
            expect(userName).eq(`${newUserFirstName} ${newUserLastName}`);
        })

});

it('Test 4 - Should delete New User by ID',  () => {

    return axios({
        method: 'DELETE',
        url: `${baseUrlKompot}/user/${userId}`,
        headers: {
            Authorization: `${adminToken}`
        }
    })
        .then(res => {
            expect(res.status).eq(200);
            expect(res.data.message).eq('User deleted');
        })

});

it('Test 5 - Should check if New User was deleted by ID',  () => {

    return axios({
        method: 'GET',
        url: `${baseUrlKompot}/user`,
        headers: {
            Authorization: `${adminToken}`
        }
    })
        .then(res => {
            let deletedCard = 0;
            for(let i = 0; i < res.data.payload.length; i++){
                if(res.data.payload[i]._id === `${userId}`){
                    deletedCard++;
                }
            }
            expect(deletedCard).eq(0);

        })

})

});


