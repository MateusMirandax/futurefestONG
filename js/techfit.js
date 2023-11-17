const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { stringify } = require("querystring");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/techfit", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UsuarioSchema = new mongoose.Schema({
    email : {type : String, required : true},
    nome : {type : String },
    esporte : {type : String},
    batimentos : {type : String},
    senha : {type : String, required : true}
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

app.post("/cadastro", async (req, res) => {
    const email = req.body.email;
    const nome = req.body.nome;
    const esporte = req.body.esporte;
    const batimentos = req.body.batimentos;
    const senha = req.body.senha;

    if(email == null || nome == null || esporte == null || batimentos == null || senha == null){
        return res.status(400).json({error : "Preencher todos os campos"});
    }

    const emailExiste  = await Usuario.findOne({email : email});
    
    if(emailExiste){
        return res.status(400).json({error : "O email informado já existe!"});
    }

    const usuario = new Usuario({
      email: email,
      nome : nome,
      esporte : esporte,
      batimentos : batimentos,
      senha: senha
  });
  
    try {
      const newUsuario = await usuario.save();
      res.json({ error: null, msg: "Cadastro ok", UsuarioId: newUsuario._id });
    } catch (error) {}
  
  });

  app.get("/cadastro.html", async (req, res) => {
    res.sendFile(__dirname + "/cadastro.html");
  });

  app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
