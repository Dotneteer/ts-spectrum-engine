var express = require('express');
var router = express.Router();


/* GET no-obfuscation page. */
router.get('/default', function(req, res, next) {
  res.render('no-obfuscation', { title: 'No Obfuscation Test' });
});


/* GET boolean-literal page. */
router.get('/boolean-literal', function(req, res, next) {
  res.render('boolean-literal-test', { title: 'Test: boolean-literal' });
});

/* GET domain-lock-local page. */
router.get('/domain-lock-local', function(req, res, next) {
  res.render('domain-lock-local-test', { title: 'Test: domain-lock-local' });
});

/* GET domain-lock-azure page. */
router.get('/domain-lock-azure', function(req, res, next) {
  res.render('domain-lock-azure-test', { title: 'Test: domain-lock-azure' });
});

/* GET local-declaration page. */
router.get('/local-declaration', function(req, res, next) {
  res.render('local-declaration-test', { title: 'Test: local-declaration' });
});

/* GET local-declaration page. */
router.get('/local-declaration-base62', function(req, res, next) {
  res.render('local-declaration-base62-test', { title: 'Test: local-declaration-base62' });
});

/* GET property-indirection page. */
router.get('/property-indirection', function(req, res, next) {
  res.render('property-indirection-test', { title: 'Test: property-indirection' });
});

/* GET string-literal page. */
router.get('/string-literal', function(req, res, next) {
  res.render('string-literal-test', { title: 'Test: string-literal' });
});

/* GET property-name page. */
router.get('/property-name', function(req, res, next) {
  res.render('property-name-test', { title: 'Test: property-name' });
});

/* GET partial-property-name page. */
router.get('/partial-property-name', function(req, res, next) {
  res.render('partial-property-name-test', { title: 'Test: partial-property-name' });
});

/* GET octal-literal page. */
router.get('/octal-literal', function(req, res, next) {
  res.render('octal-literal-test', { title: 'Test: octal-literal' });
});

/* GET randomize-octal-literal page. */
router.get('/randomize-octal-literal', function(req, res, next) {
  res.render('randomize-octal-literal-test', { title: 'Test: randomize-octal-literal' });
});

/* GET control-flow page. */
router.get('/control-flow', function(req, res, next) {
  res.render('control-flow-test', { title: 'Test: control-flow' });
});

/* GET partial-control-flow page. */
router.get('/partial-control-flow', function(req, res, next) {
  res.render('partial-control-flow-test', { title: 'Test: partial-control-flow' });
});

/* GET randomize-control-flow page. */
router.get('/randomize-control-flow', function(req, res, next) {
  res.render('randomize-control-flow-test', { title: 'Test: randomize-control-flow' });
});

/* GET function-reordering page. */
router.get('/function-reordering', function(req, res, next) {
  res.render('function-reordering-test', { title: 'Test: function-reordering' });
});

/* GET function-reordering-randomize page. */
router.get('/function-reordering-randomize', function(req, res, next) {
  res.render('function-reordering-randomize-test', { title: 'Test: function-reordering-randomize' });
});

module.exports = router;
