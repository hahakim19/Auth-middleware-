const express = require("express");
const mysql = require('mysql');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { requireAuth, checkuser, requireAuthAd, checkuser2 } = require('./middleware/Authmiddleware');
const cookieparser = require('cookie-parser')
const app = express();

app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(cookieparser())

//connection to the db 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '123456789',
        database: 'pfe'
    }

)
db.connect((err) => {

    if (err) console.log(err);
    else app.listen(5000, (err) => {
        if (err) console.log(err);
        else console.log('we listening on port 5000 ');
    });
});

/////////////////////////////////////////////////////////////////////////

const createwebtoken = (id) => {

    return jwt.sign({ id }, 'tigre tigre', { expiresIn: 60 * 60 * 24 });
}
const createwebtoken2 = (id) => {

    return jwt.sign({ id }, 'mimosa', { expiresIn: 60 * 60 * 24 });
}


/* app.get('*', checkuser2)

app.post('*', checkuser2) */

app.get('/', (req, res) => {

    res.render("first_page")

})
app.get('/list', requireAuth, checkuser, (req, res) => {
    db.query("SELECT idpatient,Nom,Prenom,Tel,Adress FROM patient", (err, rows) => {
        if (!err) {
            res.render("liste_des_patient", { rows })
            console.log(rows);
        }

        else console.log('you kidding me ');
    })
})





app.get('/form', requireAuth, checkuser, (req, res) => {
    res.render('lastform');
})

app.post('/form', checkuser, (req, res) => {
    let { Nom_patient, Prenom_patient, Date_de_naissance,
        Lieu_de_naissance, Adress, Email, Tel, sexe, covidé, Quand, Combien_de_jour,
        Fievre, Toux, Fatigue, Courbature, Autre_symp, description, maladie_chronique, insuffisance_cardiaque, diabet, asthme, insuffisance_renale, cancer, Autre_mal, autre_maladie, allergie,
        quel_allergie, grossesse, alaiter, vaccinrec, poid, taille, grpsng, vaccin, consentant,
        stafmed, place


    } = req.body;
    let date = new Date()
    date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()

    /*, Maladie_chro_22=?, Autre_maladie_chro=? ,Allergie=? ,Quelle_allergie=? ,Grossesse=? ,Allaitement=? ,vaccin_de_saison=? ,Poids=? ,Taille=?, Group_sanguin=? ,Vaccin_covid=?, Consentant=? ,Nom_Personelle=?*/
    db.query("INSERT INTO patient SET Nom=? , Prenom=? , Date_de_naissance=? ,Lieu=? ,Adress=? ,Email=? ,Tel=? ,Sexe=? ,Deja_covider=? ,Quand=?  ,Combien_de_jours=?, Fievre=? ,Toux=? ,Fatigue=? ,Courbature=? ,Autre_symp=?,Description=? , Maladie_chro=? , insuffisance_cardiaque=? ,diabet=?,asthme=?,insuffisance_renale=?,cancer=?,Autre_mal=? ,Autre_maladie_chro=?,Allergie=?,Quelle_allergie=? ,Grossesse=? ,Allaitement=? ,vaccin_de_saison=? ,Poids=? ,Taille=?, Group_sanguin=? ,Vaccin_covid=?, Consentant=? ,Nom_Personelle=? ,data_1er_dose=? ,emplacement=? ",
        [Nom_patient, Prenom_patient, Date_de_naissance, Lieu_de_naissance,
            Adress, Email, Tel, sexe, covidé, Quand, Combien_de_jour,
            Fievre, Toux, Fatigue, Courbature, Autre_symp, description, maladie_chronique, insuffisance_cardiaque, diabet, asthme, insuffisance_renale, cancer, Autre_mal, autre_maladie, allergie,
            quel_allergie, grossesse, alaiter, vaccinrec, poid, taille, grpsng, vaccin, consentant,
            stafmed, date, place

        ], (err, rows) => {

            if (!err) {console.log(rows); res.redirect('/list')}
            else console.log("kyn err chemitha ");
        })
})


app.get('/list/:id', checkuser, requireAuth, (req, res) => {
    db.query("DELETE FROM patient WHERE idpatient=?", [req.params.id], (err) => {
        if (err) console.log(err)
        else {
            console.log("we are good this one")
            res.redirect('/list')
        }
    })
})

app.get('/list-edit/:id', checkuser, requireAuth, (req, res) => {


    db.query("SELECT * FROM patient WHERE idpatient=?", [req.params.id], (err, rows) => {
        if (!err) { res.render('list-edit', { rows }) }
        else console.log('err here ');

    })

})

app.post('/list-edit/:id', checkuser, requireAuth, (req, res) => {
    let { Nom_patient, Prenom_patient, Date_de_naissance,
        Lieu_de_naissance, Adress, Email, Tel, sexe, covidé, Quand, Combien_de_jour,
        Fievre, Toux, Fatigue, Courbature, Autre_symp, description, maladie_chronique, insuffisance_cardiaque, diabet, asthme, insuffisance_renale, cancer, Autre_mal, autre_maladie, allergie,
        quel_allergie, grossesse, alaiter, vaccinrec, poid, taille, grpsng, vaccin, consentant,
        stafmed
    } = req.body;

    db.query("UPDATE patient SET Nom=? , Prenom=? , Date_de_naissance=? ,Lieu=? ,Adress=? ,Email=? ,Tel=? ,Sexe=? ,Deja_covider=? ,Quand=?  ,Combien_de_jours=?, Fievre=? ,Toux=? ,Fatigue=? ,Courbature=? ,Autre_symp=?,Description=? , Maladie_chro=? , insuffisance_cardiaque=? ,diabet=?,asthme=?,insuffisance_renale=?,cancer=?,Autre_mal=? ,Autre_maladie_chro=?,Allergie=?,Quelle_allergie=? ,Grossesse=? ,Allaitement=? ,vaccin_de_saison=? ,Poids=? ,Taille=?, Group_sanguin=? ,Vaccin_covid=?, Consentant=? ,Nom_Personelle=?  WHERE idpatient=?",
        [Nom_patient, Prenom_patient, Date_de_naissance,
            Lieu_de_naissance, Adress, Email, Tel, sexe, covidé, Quand, Combien_de_jour,
            Fievre, Toux, Fatigue, Courbature, Autre_symp, description, maladie_chronique, insuffisance_cardiaque, diabet, asthme, insuffisance_renale, cancer, Autre_mal, autre_maladie, allergie,
            quel_allergie, grossesse, alaiter, vaccinrec, poid, taille, grpsng, vaccin, consentant,
            stafmed, req.params.id], (err) => {
                if (!err) res.redirect("/list");
                else console.log("we got a probleme here ")
            })
})



app.post('/list', checkuser, requireAuth, (req, res) => {

    let { chercher_patient } = req.body;
    db.query("SELECT idpatient,Nom,Prenom,Tel,Adress FROM patient WHERE Nom LIKE ? OR Prenom LIKE ? ", ["%" + chercher_patient + "%", "%" + chercher_patient + "%"], (err, rows) => {
        if (!err) {

            res.render("liste_des_patient", { rows })
            console.log(rows);
        }

        else console.log('you kidding me ');
    })

})




app.get('/login', (req, res) => {
    res.render('login')

})


app.get('/signup', (req, res) => {

    res.render('signup')
})
app.post('/add', requireAuthAd, checkuser2, async (req, res) => {

    let { username, password, Nom, Prenom, Date_de_naissance, Lieu } = req.body;
    let salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt)
    console
    db.query("INSERT INTO utilisateur SET username=? , password=? ,Prenom=?,Nom=? , Date_de_naissance=? ,Lieu_de_travaille=?,status='1'", [username, password, Prenom, Nom, Date_de_naissance, Lieu], (err) => {
        if (!err) res.redirect('/user_list')
        else console.log('there is a probleme')
    })



})
app.get('/dashbord', checkuser, requireAuth, async (req, res) => {
    let total_vacciner, deuxieme_dose, vacciner_today, Oran, Alger, Constantine, username;
    let date = new Date()
    date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
    await db.query('SELECT COUNT(idpatient) FROM pfe.patient', (err, rows) => {
        if (!err) {



            db.query('SELECT COUNT(2eme_dose) FROM pfe.patient', (err, data) => {
                if (!err) {


                    db.query('SELECT COUNT(data_1er_dose) FROM pfe.patient WHERE data_1er_dose=? ', [date], (err, rows2) => {
                        if (!err) {





                            db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "oran" ', (err, rows3) => {

                                if (!err) {




                                    db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "alger" ', (err, rows4) => {



                                        if (!err) {

                                            db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "constantine" ', (err, rows5) => {
                                                if (!err) {



                                                    total_vacciner = rows[0]
                                                    deuxieme_dose = data[0]
                                                    vacciner_today = rows2[0]
                                                    Oran = rows3[0]
                                                    Alger = rows4[0]
                                                    Constantine = rows5[0]


                                                    res.render('dashbordutil', { total_vacciner, deuxieme_dose, vacciner_today, Oran, Alger, Constantine })

                                                    console.log('la repense', total_vacciner, ' le 2 ', deuxieme_dose, 'le 3', vacciner_today);
                                                }


                                            })

                                        }
                                    })


                                }
                            })

                        }
                        else console.log('kyna wlh la kyna 2 ' ,err)
                    })



                }


            })


        }
        else console.log('probproblem')
    })







})



app.post('/login', (req, res) => {

    let { username, password } = req.body;
    usr = username;

    db.query('SELECT password FROM utilisateur WHERE username= ? ', [username], (err, data) => {
        if (!err) {

            db.query('SELECT idutilisateur,status FROM utilisateur WHERE username=?', [username], async (err, rows) => {

                if (!err) {
                    console.log('sssssoooooon status', rows)

                    if (rows[0].status == 1) {
                        const token = createwebtoken(rows[0])
                        console.log('le statu', rows[0].status)
                        console.log("le id de l'utilisateur", rows[0])
                        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
                        let auth = await bcrypt.compare(password, data[0].password)
                        if (auth) {
                            res.redirect('/dashbord')
                        }
                        else {
                            res.redirect('/login')
                        }

                    }

                    else if (rows[0].status == 0) {

                        const token = createwebtoken2(rows[0])
                        console.log('le statu', rows[0].status)
                        console.log("le id de l'utilisateur", rows[0])
                        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
                        let auth = await bcrypt.compare(password, data[0].password)
                        if (auth) {
                            res.redirect('/admin')
                        }
                        else {
                            res.redirect('/login')
                        }

                    }

                }
                else console.log(err)


            })



        }
        else console.log('possible')

    })




})



app.get('/admin', requireAuthAd, checkuser2, async (req, res) => {
    let total_vacciner, deuxieme_dose, vacciner_today, Oran, Alger, Constantine, username;
    let date = new Date()
    date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
    await db.query('SELECT COUNT(idpatient) FROM pfe.patient', (err, rows) => {
        if (!err) {



            db.query('SELECT COUNT(2eme_dose) FROM pfe.patient', (err, data) => {
                if (!err) {


                    db.query('SELECT COUNT(data_1er_dose) FROM pfe.patient WHERE data_1er_dose=? ', [date], (err, rows2) => {
                        if (!err) {





                            db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "oran" ', (err, rows3) => {

                                if (!err) {




                                    db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "alger" ', (err, rows4) => {



                                        if (!err) {

                                            db.query('SELECT COUNT(emplacement) FROM pfe.patient WHERE emplacement= "constantine" ', (err, rows5) => {
                                                if (!err) {



                                                    total_vacciner = rows[0]
                                                    deuxieme_dose = data[0]
                                                    vacciner_today = rows2[0]
                                                    Oran = rows3[0]
                                                    Alger = rows4[0]
                                                    Constantine = rows5[0]


                                                    res.render('dashbordadmin', { total_vacciner, deuxieme_dose, vacciner_today, Oran, Alger, Constantine })

                                                    console.log('la repense', total_vacciner, ' le 2 ', deuxieme_dose, 'le 3', vacciner_today);
                                                }


                                            })

                                        }
                                    })


                                }
                            })

                        }
                        else console.log('kyna wlh la kyna 1 ' ,err)
                    })



                }


            })


        }
        else console.log('probproblem')
    })






})

app.get('/add', requireAuthAd, checkuser2, (req, res) => {
    res.render('adduser')
})




app.get('/user_list', requireAuthAd, checkuser2, (req, res) => {

    db.query('SELECT * FROM utilisateur', (err, rows) => {
        if (!err) res.render('list_utilisateur', { rows })
        else console.log(err)


    })
})



app.get('/user_list/:id', requireAuthAd, checkuser2, (req, res) => {
    db.query('DELETE FROM utilisateur WHERE idutilisateur=?', [req.params.id], (err) => {
        if (!err) {
            res.redirect('/user_list')
        }
        else console.log(err)
    })
})


app.get('/user-edit/:id', requireAuthAd, checkuser2, (req, res) => {
    db.query('SELECT * FROM utilisateur WHERE idutilisateur=?', [req.params.id], (err, rows) => {
        if (!err) res.render('user-edit', { rows })
        else console.log('err here ', err)


    })
})

app.post('/user-edit/:id', requireAuthAd, checkuser2, async (req, res) => {
    let { username, password, Nom, Prenom, Date_de_naissance, Lieu } = req.body;
    let salt = await bcrypt.genSalt()
    console.log('le mdp est ..........', password)
    password = await bcrypt.hash(password, salt)
    console.log('le mdp  hashed   est ..........', password)
    db.query("UPDATE utilisateur SET username=? , password=? ,Prenom=?,Nom=? , Date_de_naissance=? ,Lieu_de_travaille=? ,status='1' WHERE idutilisateur=?", [username, password, Prenom, Nom, Date_de_naissance, Lieu, req.params.id], (err) => {
        if (!err) res.redirect('/admin')
        else console.log('there is a probleme', err)
    })



})
app.post('/user_list', requireAuthAd, checkuser2, (req, res) => {
    let { chercher_patient } = req.body
    db.query('SELECT * FROM utilisateur  WHERE Nom LIKE ? OR Prenom LIKE ?', ["%" + chercher_patient + "%", "%" + chercher_patient + "%"], (err, rows) => {
        if (!err) {
            res.render('list_utilisateur', { rows })
        }
    })
})

app.get('/dose_2', requireAuth, checkuser, (req, res) => {
    try {
        rows = [{ Nom: '', Prenom: '', Date_de_naissance: '', Lieu: '', Tel: '', data_1er_dose: '', Vaccin_covid: '' }]
        res.render('deuxiemedose', { rows })

    } catch {
        console.log("errrr2354")
    }

})


app.post('/dose_2', requireAuth, checkuser, (req, res) => {

    let { chercher_patient } = req.body



    db.query('SELECT * FROM patient  WHERE  Nom LIKE ? OR Prenom LIKE ?  OR Tel=?', ["%" + chercher_patient + "%", "%" + chercher_patient + "%", "%" + chercher_patient + "%"], (err, rows) => {
        if (!err) {


            let loc=rows[0]

            console.log('le loc est    .... ',loc['2eme_dose'])



            res.render('deuxiemedose', { rows })
        }
        else console.log('ufuyfuyfulyferr')
    })

})

app.post('/dose_2_add/:id', requireAuth, checkuser, (req, res) => {
    let { dose2 } = req.body
    let date = new Date()
    date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
    db.query('UPDATE patient SET 2eme_dose=? , date_2eme_dose=? WHERE idpatient=?', [dose2, date, req.params.id], (err) => {
        if (!err) res.redirect('/dashbord')
        else console.log('errrrrrrrrrrrrrrrr')
    })


})


app.get('/logout', (req, res) => {

    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')

})