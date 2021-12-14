const mongoose = require('mongoose');
const _ = require("colors");
const data = require('./model');
var _baseValues_ = {};
let body_ = {};
body_.Connect = function(i) {
    if (!i || typeof i != "object" || !i.url) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"faltando 'url' em .create({ url:... })".bold.red}`);
    let db_ = mongoose.connect(i.url, {
        useNewUrlParser: false,
        useUnifiedTopology: true
    });
    let response = "conectado ao mongodb";
    if (i.response) response = i.response;
    db_.then(() => console.log("[" + "database".yellow.bold + "] " + response)).catch(err => console.log(err));
    this.Variables = function(bases) {
        if (typeof bases != "object") throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"tipo invalido nas variaveis. crie um corpo de variaveis!".bold.red}`);
        _baseValues_ = bases;
    };
    this.Get = async function(key_, id) {
        if (!key_) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"faltando 'key' em get()".bold.red}`);
        if (!id) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"faltando 'id' em get()".bold.red}`);
        let user = await data.findOne({ key: `${key_}_${id}` });
        let key__ = _baseValues_[key_];
        if (!key__) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"você não definiu ".bold.red + key_.bold.yellow + " em .Variables({...})".bold.red}`);
        if (!user) {
            user = key__;
        } else user = user.value;
        return Number(user) === NaN ? user : Number(user);
    };
    this.Set = async function(key_, user_, value) {
        if (!key_) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"faltando 'key' em .set({...})".bold.red}`);
        if (!_baseValues_[key_]) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"você não definiu ".bold.red + key_.bold.yellow + " em .Variables({...})".bold.red}`);
        if (!user_) throw TypeError(`${"[".bold}${"database".yellow.bold }${"]".bold} ${"faltando 'id' em .set({...})".bold.red}`);
        let user = await data.findOne({ key: `${key_}_${user_}` });
        if (!user) {
            const newUser = await data.create({
                key: `${key_}_${user_}`,
                value: value
            });
            await newUser.save();
        } else {
            await data.updateOne({
                key: user.key,
                value: value
            });
        };
    };
    this.All = async function() {
        let all = mongoose.model("main");
        all = await all.find({});
        return all;
    };
    this.Delete = async function(key_, user_) {
        await data.findOneAndDelete({ key: `${key_}_${user_}` });
    };
}
module.exports = body_;
