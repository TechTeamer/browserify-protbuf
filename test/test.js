/* eslint-env node, mocha */
const assert = require('chai').assert

describe('test require', function () {
  let testServiceProto
  let otherServiceProto

  let TestService
  let OtherService

  it('can required proto file', function () {
    testServiceProto = require('./protocol/TestService.proto')
    otherServiceProto = require('./protocol/OtherService.proto')
  })

  it('required a valid protobuf roots', function () {
    assert.strictEqual(typeof testServiceProto.lookup, 'function')
    assert.strictEqual(typeof testServiceProto.lookupService, 'function')
    assert.strictEqual(typeof testServiceProto.lookupType, 'function')
    assert.strictEqual(typeof testServiceProto.lookupTypeOrEnum, 'function')
    assert.strictEqual(typeof testServiceProto.lookupEnum, 'function')

    assert.strictEqual(typeof otherServiceProto.lookup, 'function')
    assert.strictEqual(typeof otherServiceProto.lookupService, 'function')
    assert.strictEqual(typeof otherServiceProto.lookupType, 'function')
    assert.strictEqual(typeof otherServiceProto.lookupTypeOrEnum, 'function')
    assert.strictEqual(typeof otherServiceProto.lookupEnum, 'function')
  })

  it('can found service in correct root', function () {
    TestService = testServiceProto.lookup('TestService')
    assert.strictEqual(TestService.name, 'TestService')

    OtherService = otherServiceProto.lookup('OtherService')
    assert.strictEqual(OtherService.name, 'OtherService')
  })

  it('can found method in correct service', function () {
    assert.strictEqual(TestService.methods.Echo.name, 'Echo')
  })

  it('uses different protobuf root objects for each require', function () {
    assert.strictEqual(otherServiceProto.lookup('TestService'), null)
    assert.strictEqual(testServiceProto.lookup('OtherService'), null)
  })

  it('uses can found correct type based on namespace', function () {
    assert.strictEqual(TestService.lookup('TextMessage').parent.name, 'test')
    assert.strictEqual(OtherService.lookup('TextMessage').parent.name, 'other')
  })
})
