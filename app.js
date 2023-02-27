var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
const port = 3000
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const jsonsInDir = fs.readdirSync('./directassurance').filter(file => path.extname(file) === '.json');
app.get('/', (req, res) => {
  jsonsInDir.forEach(file => {
    const fileData = fs.readFileSync(path.join('./directassurance', file));
    const json = JSON.parse(fileData.toString());
    if (json.type == 'blog_article') {
      fs.readFile("./template/index.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        let templateData = JSON.parse(jsonString.toString())
        templateData.page_description = json.short_title;
        templateData.title = json.page_title;
        templateData.description = json.page_description;
        templateData.category = json.category_slug;
        templateData.contentoTitle = json.short_title;
        templateData.slug = `/blog/${json.category_slug}/${json.uid}`;
        templateData.uid = `blog.${json.category_slug}.${json.uid}`,
        templateData.grouplang = json.grouplang;
        templateData.produitSlices[1].value['non-repeat'].article_content = json.body[0].value['non-repeat'].text
        templateData.produitSlices[0].value['non-repeat'].slice_title = json.page_title
        templateData.produitSlices[0].value['non-repeat'].article_content[0].content.text = json.short_title
        if (json.banner) {
          templateData.produitSlices[0].value['non-repeat'].article_content[2].data.origin.url = json.banner.url
          templateData.produitSlices[0].value['non-repeat'].article_content[2].data.url = `${json.banner.url}?auto=compress,format`
          templateData.produitSlices[0].value['non-repeat'].article_content[2].data.alt = json.banner?.alt
        }else {
           delete templateData.produitSlices[0].value['non-repeat'].article_content[2]
        }
      
        // console.log("File data:", json.body[0].value['non-repeat'].text);
        // Un comments if you want create new files        
        // fs.writeFileSync(`./blog_article/${file}`, JSON.stringify(templateData));
      });
    }
  });

  // const geeksData = { title: "Node", article: "geeksforgeeks" };
  // const geeksObject = JSON.parse(JSON.stringify(geeksData));
  // console.log(geeksObject.article);
  // geeksObject.stack = "js";
  // geeksObject.difficulty = 1;
  // const dataJSON = JSON.stringify(geeksObject);

  // fs.writeFileSync("data.json", dataJSON);
  // console.log(geeksObject);

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Node app listening on port ${port}`)
})

module.exports = app;
