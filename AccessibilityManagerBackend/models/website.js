const pageSchema = require('./page');
const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  //Url obrigatório, único na base de dados e tem de ser válido
  url: { type: String, validate: { validator: isValidWebsiteUrl, message: "{VALUE} url inválido!" }, required: true, unique: true },
  //Estado do website na plataforma de monitorização de acessibilidade
  status: { type: String, default: 'Por Avaliar' },
  // Array de strings vazio por padrão
  pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
  dateAdded: { type: Date, default: Date.now },
  lastReportDate: { type: Date },
  orderOfReports: [{ type: String }],
  reports: [{ type: Object }],
  topErrors: { type: Object },
});


//https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
//Verificar se o URL é válido
function isValidWebsiteUrl(string) {
  if (string.startsWith("http://") || string.startsWith("https://")) {


    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return true;
  } else {
    return false;
  }

}

module.exports = mongoose.model('Website', websiteSchema);



