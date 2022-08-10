const express = require('express');
const router = express.Router();
const News = require('../models/news');

router.all('*', (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('login');
    return;
  }
  next();
});

/* GET home page. */
router.get('/', (req, res, next) => {
  News.find({}, (err, data) => {
    // console.log(data);
    res.render('admin/index', { title: 'Admin', data });
  });
});

router.get('/news/add', (req, res) => {
  res.render('admin/news-form', { title: 'Admin', body: {}, errors: {} });
});

router.post('/news/add', (req, res) => {
  const body = req.body;

  const newsData = new News({
    title: body.title,
    description: body.description,
  });

  const errors = newsData.validateSync();

  console.log(errors);

  newsData.save((err) => {
    if (err) {
      res.render('admin/news-form', { title: 'Admin', errors, body });
    }
    res.redirect('/admin');
  });
});

router.get('/news/delete/:id', (req, res) => {
  News.findByIdAndDelete(req.params.id, (err) => {
    console.log(err);
    res.redirect('/admin');
  });
});

module.exports = router;
