# Mongoose Kids!
mongoose facilitado, todas as funções pré criadas (incluindo conexão).

------------

##configuração / iniciação
1. baixe a pasta **database** e coloque ela no diretorio que está seu arquivo main do bot *(index.js, bot.js etc...)*
**exemplo:** `./`
2. cole o seguinte codigo em seu arquivo main *(index.js, bot.js etc...)*:

```js
//isso pode ser colado logo à baixo de "const client =..."
/*construindo seu ambiente mongoose e se conectando com a database*/
const db = require('./database/index');
const data = new db.Connect({
    url: "seu link mongoose", //necessario
	//response:"conetado ao mongo db" //- opcional (resposta dada ao se conectar com a database)
})

/*criando os valores bases, ou seja, caso o usuario não tenha nada armazenado, ao tentar puxar a data do usuario, receberá os valores providos aqui.*/
data.Variables({
    money: 100,
	power:900,
	//...adicione mais ou exclua estes se necessario. qualquer tipo de armazenagem é possivel, incluindo texto e imagem.
}); 
//database conectada e estabelecida :D
```

## metodos
- Get({...}) - obtem um valor
- Set({...}) - define um valor
- Delete({...}) - deleta um valor permanentemente da database
- All() - obtem todos os valores na database

### exemplo de index.js
```js
//index.js

//conectar com o discord
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const config = require("./config.json");


//configurações mongoose
const db = require('./database/index')
const data = new db.Connect({
    url: "mongodb+srv://batata:sensei@batata.mongodb.net/batata"
})
data.Variables({
    dindin: 100
})
//fim da configuração

client.on("ready", async() => {
    console.clear()
    console.log(`${client.user.tag}`)

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();

    // bloco de comando
    if (comando === "ping") {
        message.channel.send('pong!')
    }
    if (comando === "eval") {
        eval(`(async()=>{${args.join(" ")}})()`)
    }
    if (comando === "set") {
        await data.Set('dindin', message.author.id, 999999)
        message.channel.send(`money de ${message.author.tag} definido em 999999`)
    }
    if (comando === "get") {
        let meu = await data.Get('dindin', message.author.id);
        message.channel.send(`${message.author.tag} tem ${meu} de money`)
    }
    if (comando === "delete") {
        await data.Delete('dindin', message.author.id);
        message.channel.send(`${message.author.tag} teve seu money resetado`)
    }
	    if (comando === "tudo") {
        let tudo = await data.All();
		console.log("todas as datas armazenadas:");
		console.log(tudo)
    }

});

client.login(config.token);
```
