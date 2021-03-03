const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();

img = [];

const scrap = async () => {
        try{
            const { data } = await axios.get('theinternship.io/');
            let $ = cheerio.load(data);

            $('.center-logos').each(function(i,_){
                if($(this)['0'] && $(this)['0'].attribs)
                    image = `${$(this)['0'].attribs.src}`;
                img[i] = {img : image}
            })
            $('.list-company').each(function(i,_){
                if($(this)['0'] && $(this)['0'].children[0])
                    text = `${$(this)['0'].children[0].data}`
                    img[i].size = text.length
                    img[i].data = text
            })

            img.sort((a,b) => a.size - b.size)
    }catch(err){
        throw new Error("Something went wrong.")
    }
   
};

app.use('/',async (req,res,next)=>{
    try{
        await scrap()
        result = img.map(e =>  {
            return {logo : `https://theinternship.io/${e.img}`}
        });
        res.status(200).send({
            companies : result
        })
    }catch(err){
        res.status(500).send(err.message)
    }
})

app.listen(3000,()=>{
    console.log("Start server on port 3000")
})
