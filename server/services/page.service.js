var config = require('config.json');
var _ = require('lodash');
var Q = require('q');
var slugify = require('helpers/slugify');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var client = new MongoClient(config.connectionString);
client.connect();
var db = client.db(config.dbname);

var service = {};

service.getAll = getAll;
service.getBySlug = getBySlug;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.collection('pages').find().toArray(function (err, pages) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        pages = _.sortBy(pages, function (p) { return p.title.toLowerCase(); });

        deferred.resolve(pages);
    });

    return deferred.promise;
}

function getBySlug(slug) {
    var deferred = Q.defer();

    db.collection('pages').findOne({
        slug: slug
    }, function (err, page) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(page);
    });

    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.collection('pages').findOne(
        { _id: new mongo.ObjectId(_id) },
        function (err, page) {
          if (err) deferred.reject(err.name + ': ' + err.message);

          deferred.resolve(page);
    });

    return deferred.promise;
}

function create(pageParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    db.collection('pages').insertOne(
        pageParam,
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, pageParam) {
    var deferred = Q.defer();

    // generate slug from title if empty
    pageParam.slug = pageParam.slug || slugify(pageParam.title);

    // fields to update
    var set = _.omit(pageParam, '_id');

    db.collection('pages').update(
        { _id: new mongo.ObjectId(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.collection('pages').deleteOne(
        { _id: new mongo.ObjectId(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
