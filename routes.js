const express = require('express');
const passport = require('passport');
const router = express.Router();
const Asso = require("./models/Asso")
const bcrypt = require('bcrypt')
const Event = require("./models/Event")
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { events } = require('./models/Asso');
const multer = require('multer');
const uuid = require('uuid').v4
const fs = require('fs')
const csv = require('csv-parser');
const { stringify } = require('querystring');

const upload = multer({ dest: 'public/uploads/' });

function getSpices(events, mail) {
  var spices = 0; events.forEach(function (event) { if (event.staffs) { (event.staffs).forEach(function (staff) { if (staff.mail == mail) spices += parseInt(staff.spices); }) } })
  return spices;
}

function getEvents(events, mail) {
  var spices = 0; events.forEach(function (event) { if (event.staffs) { (event.staffs).forEach(function (staff) { if (staff.mail == mail) spices += 1; }) } })
  return spices;
}

function getEventList(events, mail) {
  var list = []; events.forEach(function (event) {
    if (event.staffs) {
      (event.staffs).forEach(function (staff) {
        if (staff.mail == mail) list.push({
          name: event.name,
          date: event.date,
          spice: staff.spices
        });
      })
    }
  })
  return list;
}

router.get('/', checkAuthenticated, (req, res) => {
  var members;
  if (req.user.email == "leslie@mail.com") {
    res.redirect('/manage');
  } else {
    Asso.findOne({ name: req.user.name }, function (err, response) {
      if (err || response == null) {
        res.status(400).send('No asso founded')
      } else {
        members = response.members;
        members.sort((a, b) => a.email.localeCompare(b.email))
        if (req.query._member_promo && req.query._member_promo != "Toutes") {
          members = members.filter(o => o.promo == req.query._member_promo);
        }
        if (req.query._member_poste && req.query._member_poste != "Tous") {
          if (req.query._member_poste == "Staff")
            members = members.filter(o => o.job === "membre");
          else
            members = members.filter(o => o.job != "membre");

        }
        Event.find({ asso: req.user.name }, function (err, events) {
          if (err) {
            res.status(400).send('Error : with events')
          } else {
            res.render('index.ejs', { name: req.user.name, email: req.user.email, allmembers: members, allevents: events, error: (req.query.error ? 'Ce staff fait déjà partie de vos membres' : undefined) })
          }
        })
      }
    })
  }
})

router.get('/manage', checkAuthenticated, async (req, res) => {
  var eventsPerAsso = [];
  if (req.user.email != "leslie@mail.com") {
    res.redirect('/');
    return;
  }
  await Event.find({}, async function (err, events) {
    events.sort((b, a) => a.date.localeCompare(b.date));
    await Asso.find({}, async function (err, assos) {
    }).then((result) => {
      result = result.sort((a, b) => a.name.localeCompare(b.name))
      res.render('manage.ejs', { name: req.user.name, email: req.user.email, assos: result, allevents: events })
    })
  })

})

/* router.get('/user', checkAuthenticated, async (req, res) => {
  var infos = [];
  await Asso.find({}, async function (err, assos) {
    await assos.forEach(async function (asso) {
      if (asso.email == 'leslie@mail.com') {
        return;
      }
      members = (asso.members).filter(o => o.email == req.query.user);
      if (members && members.length > 0) {
        await Event.find({ asso: asso.name }, function (err, events) {
          infos.push({ asso: asso.name, events: getEventList(events, req.query.user), total: getSpices(events, req.query.user) });
        })
      }
      console.log(infos);
    })
  }).then(() => {
    res.render('user.ejs', { asso: req.query._name, email: req.user.email, searchuser: req.query.user, infos: infos });
  })
}) */

router.get('/assoInfo', checkAuthenticated, (req, res) => {
  var members;
  Asso.findOne({ name: req.query._name }, function (err, response) {
    members = response.members;
    members.sort((a, b) => a.email.localeCompare(b.email))
    if (req.query._member_promo && req.query._member_promo != "Toutes") {
      members = members.filter(o => o.promo == req.query._member_promo);
    }
    if (req.query._member_poste && req.query._member_poste != "Tous") {
      if (req.query._member_poste == "Staff")
        members = members.filter(o => o.job === "membre");
      else
        members = members.filter(o => o.job != "membre");

    }
    Event.find({ asso: req.query._name }, function (err, events) {
      events = events.sort((b, a) => a.date.localeCompare(b.date))
      res.render('assoInfo.ejs', { asso: req.query._name, email: req.user.email, allevents: events, allmembers: members, allbudgets: response.budgets, allnotes: response.Infos })
    })
  })
})

router.post('/getCSV', checkAuthenticated, async (req, res) => {
  const data = [];
  const header = [];
  var members;
  var allevents;

  await Event.find({ asso: req.query.asso }, function (err, events) {
    allevents = events
  })

  header.push({ id: 'email', title: 'Email' })
  header.push({ id: 'promo', title: 'Promotion' })
  allevents.forEach(function (event) {
    header.push({ id: event._id, title: event.name });
  })
  header.push({ id: 'total', title: 'Total \épices' })

  await Asso.findOne({ name: req.query.asso }, function (err, response) {
    members = response.members;
    members.sort((a, b) => a.email.localeCompare(b.email))
    members.forEach(function (member) {
      var oneman = { email: member.email, promo: member.promo, total: getSpices(allevents, member.email) }
      allevents.forEach(function (event) {
        oneman[event._id] = getSpices([event], member.email);
      })
      data.push(oneman)
    })
  })

  const csvWriter = createCsvWriter({
    path: 'public/upload/extract_paprika.csv',
    header: header
  })
  await csvWriter.writeRecords(data)
    .then(() => { console.log('csv created') })
  var file = 'public/upload/extract_paprika.csv';
  res.download(file);
})

router.post('/findEventOfAsso', checkAuthenticated, (req, res) => {
  res.redirect("/manage?_events=" + "events");
})

router.get('/editEvent', checkAuthenticated, (req, res) => {
  if (req.user.email == "leslie@mail.com") {
    Event.findOne({ name: req.query._name, date: req.query._date, asso: req.query._asso }, function (err, event) {
      if (err) {
        res.status(400).send('Error : with events')
      } else {
        res.render('editEvent.ejs', { name: "Campus Manager", email: req.user.email, allstaffs: event.staffs, eventname: event.name, eventdate: event.date, error: (req.query.error ? 'Ce staff ne fait pas partie de vos membres' : undefined) })
      }
    })
  } else {
    Event.findOne({ name: req.query._name, date: req.query._date, asso: req.user.name }, function (err, event) {
      if (err) {
        res.status(400).send('Error : with events')
      } else {
        res.render('editEvent.ejs', { name: req.user.name, email: req.user.email, allstaffs: event.staffs, eventname: event.name, eventdate: event.date, error: (req.query.error ? 'Ce staff ne fait pas partie de vos membres' : undefined) })
      }
    })
  }
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})

router.post('/deleteMember', checkAuthenticated, (req, res, next) => {
  Asso.findOneAndUpdate({ name: req.query._asso }, {
    $pull: {
      members: { email: req.query._email }
    }
  }, function (err, model) { })
  res.redirect("/");
})

router.post('/addMember', checkAuthenticated, async (req, res, next) => {
  var is_same = false;
  await Asso.findOne({ name: req.user.name }, function (err, response) {
    (response.members).some(function (a) {
      if (a.email === req.body.member_email) {
        is_same = true;
        return true;
      }
    });
  })

  if (is_same == true) {
    res.redirect("/" + "?error=oui");
  } else {
    Asso.findOneAndUpdate({ name: req.query._asso }, {
      $push: {
        members: { email: req.body.member_email, promo: req.body.member_promo, job: req.body.member_job }
      }
    }, function (err, model) {
      res.redirect("/");
    })
  }
})

router.post('/addBudget', checkAuthenticated, async (req, res, next) => {
  Asso.findOneAndUpdate({ name: req.query.asso }, {
    $push: {
      budgets: { description: req.body.budget_description, date: req.body.budget_date, budget: req.body.budget_amount }
    }
  }, function (err, model) {
    res.redirect("/assoInfo?_name=" + req.query.asso);
  })
})

router.post('/deleteBudget', checkAuthenticated, async (req, res, next) => {
  Asso.findOneAndUpdate({ name: req.query._asso }, {
    $pull: {
      budgets: { description: req.query._description, date: req.query._date, budget: req.query._budget }
    }
  }, function (err, model) {
    res.redirect("/assoInfo?_name=" + req.query._asso);
  })
})

router.post('/addNotes', checkAuthenticated, async (req, res, next) => {
  Asso.findOneAndUpdate({ name: req.query.asso }, {
    $push: {
      Infos: { body: req.body.notes_description, date: req.body.notes_date }
    }
  }, function (err, model) {
    res.redirect("/assoInfo?_name=" + req.query.asso);
  })
})

router.post('/deleteNotes', checkAuthenticated, async (req, res, next) => {
  Asso.findOneAndUpdate({ name: req.query._asso }, {
    $pull: {
      Infos: { body: req.query._description, date: req.query._date }
    }
  }, function (err, model) {
    res.redirect("/assoInfo?_name=" + req.query._asso);
  })
})

router.post('/addMemberFromFile', checkAuthenticated, upload.single('fileToUpload'), async (req, res, next) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      await results.forEach(async function (result) {
        console.log('DU COUP: ' + JSON.stringify(result))
        console.log('ASSO NAME: ' + req.query._asso)
        await Asso.findOneAndUpdate({ name: req.query._asso }, {
          $push: {
            members: { email: result.email, promo: result.promotion, job: result.poste }
          }
        })
      })
      res.redirect("/");
    })
})

router.post('/addStaffFromFile', checkAuthenticated, upload.single('fileToUploadStaff'), async (req, res, next) => {
  var isright = false;
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(
      csv({}),
    )
    .on('data', (data) => results.push(data))
    .on('end', async () => {

      //ca ajouter les staffs
      await Asso.findOne({ name: req.user.name }, function (err, response) {
        results.forEach(async function (toAdd) {
          /*await Event.findOne({ name: req.body.event_name }, function (err, response) {
            response.staffs.forEach(function (staff) {
              console.log('email 1: ' + staff.mail + ' et email 2: ' + toAdd.email)
              if (toAdd.pop()) {
                return;
              }
            })
          })*/
          await Asso.findOne({ name: req.user.name }, function (err, response) {
            (response.members).some(function (a) {
              if (a.email === toAdd.email) {
                Event.findOneAndUpdate({ name: req.body.event_name }, {
                  $push: {
                    staffs: {
                      "mail": toAdd.email,
                      "spices": toAdd.spices,
                    }
                  }
                }, function (err, model) { })
                return true;
              } else { return; }
            })
          })
        })
        res.redirect("/editEvent?_name=" + req.body.event_name + "&_date=" + req.body.event_date);
      })
    })
})

router.post('/deleteEvent', checkAuthenticated, (req, res, next) => {
  Event.findOneAndDelete({ name: req.query._event }, function (err, docs) { })
  res.redirect('/');
})

router.post('/addEvent', checkAuthenticated, (req, res, next) => {
  const newevent = new Event({
    asso: req.query._asso,
    name: req.body.event_name,
    date: req.body.event_date
  })
  newevent.save();
  res.redirect("/");
})

router.post('/addStaffToEvent', checkAuthenticated, async (req, res, next) => {
  var isright = false;
  await Asso.findOne({ name: req.user.name }, function (err, response) {
    (response.members).some(function (a) {
      if (a.email === req.body.staff_email) {
        isright = true;
        Event.findOneAndUpdate({ name: req.body.event_name }, {
          $push: {
            staffs: {
              "mail": req.body.staff_email,
              "spices": req.body.staff_spices
            }
          }
        }, function (err, model) { })
        return true;
      }
    });
  })

  if (isright == false) {
    res.redirect("/editEvent?_name=" + req.body.event_name + "&_date=" + req.body.event_date + "&error=oui");
  } else {
    res.redirect("/editEvent?_name=" + req.body.event_name + "&_date=" + req.body.event_date);
  }
})

router.post('/removeStaffToEvent', checkAuthenticated, (req, res, next) => {
  Event.findOneAndUpdate({ name: req.query.event_name, asso: req.user.name, date: req.query.event_date }, {
    $pull: {
      staffs: { mail: req.query.staff_mail }
    }
  }, function (err, model) {
  })
  res.redirect("/editEvent?_name=" + req.query.event_name + "&_date=" + req.query.event_date);
})

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const asso = new Asso({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    members: [
      {
        email: req.body.email_pres,
        promo: req.body.promo_pres,
        job: 'president',
      },
      {
        email: req.body.email_tres,
        promo: req.body.promo_tres,
        job: 'treasurer',
      },
      {
        email: req.body.email_secr,
        promo: req.body.promo_secr,
        job: 'secretary',
      },
    ]
  })
  try {
    const newAsso = await asso.save()
    res.redirect('/login')
  } catch (err) {
    res.redirect('/register')
  }
})

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports = router;