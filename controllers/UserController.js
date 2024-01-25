const User = require('../models/User');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const express = require('express');




class UserController {

    index(req, res) {
        res.render("user/index")

    }

    list(req, res) {
        User.find().sort({date:'desc'}).lean().then((user) => {
             res.render("user/list", {user: user})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")
        }) 
        

    }

    listAll(req, res) {
        User.find().sort({date:'desc'}).lean().then((user) => {
             res.render("user/listAll", {user: user})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")
        }) 
        

    }
    auth(req, res, next) {
        passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "login/",
            failureFlash: true
        })(req, res, next)

    }

    login(req, res) {
        res.render("user/login")

    }

    logout(req, res) {
        req.logout((err) => {
            if (err) {
                console.error(err);
                return res.redirect("/");  
            }
            req.flash('success_msg', "Deslogado com sucesso!");
            res.redirect("/");
        });
    }
    

    viewRegister(req, res) {
        res.render("user/register")

    }

   

    register(req, res) {
        try {
            const { name, email, address, cpf, phone, password } = req.body;
    
            const erros = [];
    
            if (!name || typeof name === undefined || name === null) {
                erros.push({ texto: "Nome inválido" });
            }
            if (!email || typeof email === undefined || email === null) {
                erros.push({ texto: "E-mail inválido" });
            }
            if (!password || typeof password === undefined || password === null) {
                erros.push({ texto: "Senha inválida" });
            }
            if (!(req.body.password && req.body.password.length >= 4)) {
                erros.push({ texto: "Senha muito curta" });
            }
    
            if (erros.length > 0) {
                res.render("user/register", { erros: erros });
            } else {
                
                User.findOne({ email: req.body.email }).then((user) => {
                    if (user) {
                        
                        res.render("user/register", { erros: [{ texto: "Já existe uma conta com este e-mail no nosso sistema" }] });
                    } else {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                            cpf: req.body.cpf,
                            phone: req.body.phone,
                            address: req.body.address
                        });
    
                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(newUser.password, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                                    res.render("user/register");
                                }
    
                                newUser.password = hash
                                newUser.save().then(() => {
                                    req.flash("success_msg", "Usuário criado com sucesso!");
                                    res.redirect("login/");
                                }).catch((err) => {
                                    req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!");
                                    console.log(req.body);

                                    res.render("user/register");
                                });
                            });
                        });
                    }
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno");
                    res.redirect("/");
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }
//para aprovar
async approveUser(req, res) {
    const userId = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(userId, { approved: true });

        if (!user) {
            req.flash("error_msg", "Usuário não encontrado");
            return res.redirect("/admin");
        }

        req.flash("success_msg", "Usuário aprovado com sucesso!");
        res.redirect("/admin");
    } catch (err) {
        console.error("Erro ao aprovar usuário:", err);
        req.flash("error_msg", "Houve um erro ao aprovar o usuário");
        res.redirect("/admin");
    }
}

    // Método para negar um usuário
    async denyUser(req, res) {
        const userId = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(userId, { approved: false });

        if (!user) {
            req.flash("error_msg", "Usuário não encontrado");
            return res.redirect("/admin");
        }

        req.flash("success_msg", "Usuário negado com sucesso!");
        res.redirect("/admin");
    } catch (err) {
        console.error("Erro ao negar usuário:", err);
        req.flash("error_msg", "Houve um erro ao negar o usuário");
        res.redirect("/admin");
    }
}
    

}

module.exports = UserController