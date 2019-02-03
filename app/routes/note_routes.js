const mongodb        = require('mongodb');
const sms            = require('../sms');
const path           = require('path');
const crypto         = require('crypto');
const elasticClient  = require('../elasticsearch');
const request        = require('request');

const ELASTIC_URL = "http://localhost:9200/sberbank"

// sms.configure({
//   login: 'admin',
//   password: 'password'
// })

// sms.test((err) => {
//   if(err) return console.log("SMS/Error: " + err)
// })

function generateHash(login) {
  var seed = crypto.randomBytes(20);
  var authToken = crypto.createHash('sha1').update(seed + login).digest('hex');
  return authToken;
}

module.exports = function(app, db) {

    /* ELASTIC STARTS HERE */

  app.post("/lol", (req, res) => {
    console.log(req)
    res.send("LOL")
  })
  
  app.get('/api/bank_accounts', (req, res) => {
    var thetoken = req.headers.authorization;
    db.collection('users').findOne({token: thetoken}, (err, item) => {
      var url = req.url.substr(4);
      if(err) {res.send({'error':'An error has occurred'});} 
      else if(item != null) {
        request.get({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
          if(err) res.status(403).send();
          else res.status(200).send(body);
        })
      } else {
        res.status(200)
            .send(body);
      }
    })
  })

  app.get('/api/bank_accounts/:id', (req, res) => {
    var thetoken = req.headers.authorization;
    db.collection('users').findOne({token: thetoken}, (err, item) => {
      var url = req.url.substr(4);
      if(err) {res.send({'error':'An error has occurred'});} 
      else if(item != null) {
        request.get({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
          if(err) res.status(403).send();
          else res.status(200).send(body);
        })
      } else {
        res.status(200)
            .send(body);
      }
    })
  })

  app.post('/api/bank_account', (req, res) => {
    var thetoken = req.headers.authorization;
    var details = {owner: req.body.owner, number: req.body.number}
    db.collection('users').findOne({token: thetoken}, (err, item) => {
      var url = req.url.substr(4);
      if(err) {res.send({'error':'An error has occurred'});} 
      else if(item != null) {
        db.collection('bank_accounts').insert(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            request.post({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
              if(err) res.status(403).send();
              else res.status(200).send(body);
            })
          } 
        });
        
      } else {
        res.status(200)
            .send();
      }
    })
  })

  app.put('/api/bank_accounts/:id', (req, res) => {
    var thetoken = req.headers.authorization;
    const id = req.params.id;
    const details = { '_id': mongodb.ObjectId(id) };
    db.collection('users').findOne({token: thetoken}, (err, item) => {
      var url = req.url.substr(4);
      if(err) {res.send({'error':'An error has occurred'});} 
      else if(item != null) {
        db.collection('bank_accounts').update(details, {$set: {a:1}}, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            request.put({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
              if(err) res.status(403).send();
              else res.status(200).send(body);
            })
          } 
        });
        
      } else {
        res.status(200)
            .send();
      }
    })
  })

  app.delete('/api/bank_accounts/:id', (req, res) => {
    var thetoken = req.headers.authorization;
    const id = req.params.id;
    console.log("ID = " + id);
    const details = { '_id': mongodb.ObjectId(id) };
    db.collection('users').findOne({token: thetoken}, (err, item) => {
      var url = req.url.substr(4);
      console.log(item)
      if(err) {res.send({'error':'An error has occurred'});} 
      else if(item != null) {
        db.collection('bank_accounts').remove(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            request.delete({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
              if(err) res.status(403).send();
              else res.status(200).send(body);
            })
          } 
        });
        
      } else {
        res.status(200)
            .send();
      }
    })
  })

  // app.get(/^\/(api)\/(.+)/, (req, res) => {
  //   var thetoken = req.headers.authorization;
  //   db.collection('users').findOne({token: thetoken}, (err, item) => {
  //     if (err) {
  //       res.send({'error':'An error has occurred'});
  //     } else if (item != null) {
  //       // console.log(item)
  //       var url = req.url.substr(4);
  //                       /*elasticClient.get({
  //                         index: "sberbank",
  //                         type: "users",
  //                         id: ""
  //                       }, function(elas_err, elas_res) {
  //                       })*/

  //       request.get({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
  //         // console.log(ELASTIC_URL+url)
  //         console.log(body)

  //         res.status(200)
  //           .send(body);
          
  //       })
  //       // console.log(url)
        
        
  //     } else {
  //       res.status(404)
  //       .send();
  //     }
  //   });
  // })

  // app.post(/^\/(api)\/(.+)/, (req, res) => {
  //   var thetoken = req.headers.authorization;
  //   db.collection('users').findOne({token: thetoken}, (err, item) => {
  //     if (err) {
  //       res.send({'error':'An error has occurred'});
  //     } else if (item != null) {
  //       // console.log(item)
  //       var url = req.url.substr(4);
  //                       /*elasticClient.get({
  //                         index: "sberbank",
  //                         type: "users",
  //                         id: ""
  //                       }, function(elas_err, elas_res) {
  //                       })*/

  //       request.post({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
  //         // console.log(ELASTIC_URL+url)
  //         console.log(body)
  //         res.status(200)
  //           .send(body);
  //       })
  //       // console.log(url)
       
        
  //     } else {
  //       res.status(404)
  //       .send();
  //     }
  //   });
  // })

  // app.put(/^\/(api)\/(.+)/, (req, res) => {
  //   var thetoken = req.headers.authorization;
  //   db.collection('users').findOne({token: thetoken}, (err, item) => {
  //     if (err) {
  //       res.send({'error':'An error has occurred'});
  //     } else if (item != null) {
  //       // console.log(item)
  //       var url = req.url.substr(4);
  //                       /*elasticClient.get({
  //                         index: "sberbank",
  //                         type: "users",
  //                         id: ""
  //                       }, function(elas_err, elas_res) {
  //                       })*/

  //       request.put({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
  //         // console.log(ELASTIC_URL+url)
  //         console.log(body)
  //         res.status(200)
  //           .send(body);
  //       })
  //       // console.log(url)
       
        
  //     } else {
  //       res.status(404)
  //       .send();
  //     }
  //   });
  // })

  // app.delete(/^\/(api)\/(.+)/, (req, res) => {
  //   var thetoken = req.headers.authorization;
  //   db.collection('users').findOne({token: thetoken}, (err, item) => {
  //     if (err) {
  //       res.send({'error':'An error has occurred'});
  //     } else if (item != null) {
  //       // console.log(item)
  //       var url = req.url.substr(4);
  //                       /*elasticClient.get({
  //                         index: "sberbank",
  //                         type: "users",
  //                         id: ""
  //                       }, function(elas_err, elas_res) {
  //                       })*/

  //       request.delete({url:ELASTIC_URL + url}, (err, httpResponse, body) => {
  //         // console.log(ELASTIC_URL+url)
  //         console.log(body)
  //         res.status(200)
  //           .send(body);
  //       })
  //       // console.log(url)
       
        
  //     } else {
  //       res.status(404)
  //       .send();
  //     }
  //   });
  // })
    /* ELASTIC ENDS HERE */

    /* MONGODB STARTS HERE */

    /* TEST METHODS
    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        db.collection('notes').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
      });

    app.delete('/notes/:id', (req, res) => {

        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        db.collection('notes').remove(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send('Note ' + id + ' deleted!');
          } 
        });
      });

    app.put('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        const note = { text: req.body.body, title: req.body.title };
        db.collection('notes').update(details, note, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(note);
            } 
        });
    });

    app.post('/notes', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
        db.collection('notes').insert(note, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
        });
      });


    */

    /* MONGODB ENDS HERE */

    /* SMS STARTS HERE */
    app.post('/sms', (req, res) => {
      const thesms = {text: req.body.text, num: req.body.num}
      sms.send_sms({
        phones : thesms.num,
        mes : thesms.text,
        cost : 0.0000001
    }, function (data, raw, err, code) {
        if (err) return console.log(err, 'code: '+code);
        console.log(data); // object
        console.log(raw); // string in JSON format
        res.status(200)
          .send("successful")
    });
  
    
    })

    /* SMS ENDS HERE */

    /* WEBSITE STARTS HERE */

    app.get('/', (req, res) => {
    
      res.sendFile(path.join(__dirname + '../web/index.html'))

    })

    app.post('/auth', (req, res) => {
      const details = {'login':req.body.login, 'password':req.body.password}
      db.collection('users').findOne(details, (err, item) => {
        if(err) {
          res.status(404)
            .send('Not found');
        }
        else {
          console.log(item)
          if(item != null && item.active == "true") {
            res.status(200)
            .sendFile(path.join(__dirname + "/../web/private/index.html"))
          } else {
            res.status(200)
                  .sendFile(path.join(__dirname + "/../web/verify.html"))
          }
        }
      })

    })

    app.post('/verifySMScode', (req, res) => {
      const details = {login: req.body.login}

      db.collection('users').findOne(details, (err, item) => {
        if(err) {
          res.status(404)
            .send('Not found');
        }
        else {

          console.log(item.verification_number)
          console.log(req.body.verification_number)
          console.log(item.verification_number != req.body.verification_number)
          if(item.verification_number != req.body.verification_number) {
            res.status(403).send("Wrong verification code")
          }
          db.collection('users').update(details, {$set: {'active': 'true'}}, (err, result) => {
            if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              res.send("DONE!");
          } 
          })
        }
      })

      
    })


    app.post('/register', (req, res) => {
      var verification_number = Math.floor(Math.random() * 100000) + 100000
      var hash = generateHash(req.body.login)
      const details = {'login': req.body.login, 'password': req.body.password, 'telnum': req.body.telnum, 'active': "false", 'verification_number': verification_number, 'token': hash}
      
      db.collection('users').findOne({login:details.login}, (err, item) => {
        if(err) {
          res.status(404)
            .send('Not found');
        }
        else {

          console.log(item)

          if(item == null) {
            db.collection('users').insert(details, (err, result) => {
              if (err) { 
                res.send({ 'error': 'An error has occurred' }); 
              } else {
                // Send sms
                sms.send_sms({
                  phones: req.body.telnum,
                  mes: 'Здравствуйте, ваш код: ' + verification_number,
                  cost: 0.000001 
                }, function(data, raw, err, code) {
                  if (err) return console.log(err, 'code: '+code);
                  console.log(data); // object
                  console.log(raw); // string in JSON format
                })
                //
                res.status(200)
                  .sendFile(path.join(__dirname + "/../web/verify.html"))
              }
            });
          } else {
            res.status(200)
              .redirect('/')
          }
          
        }
      })
      
      
    })

    /* WEBSITE ENDS HERE */

}
