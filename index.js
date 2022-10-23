const TelegramBot = require('node-telegram-bot-api');
const express = require("express");
const cors = require("cors");
const token = '5343232108:AAF80n7OzzEP0VeadjOSpPB_o5jqcpKFcD4';
const webAppUrl = 'https://glowing-sprinkles-ea0e72.netlify.app';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());


bot.on('message', async(msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start'){
    await bot.sendMessage(chatId,"Магазин",{
      reply_markup:{
        inline_keyboard:[
          [{text:'Заполните форму',web_app:{url:webAppUrl}}]
        ]
      }
    });
    await bot.sendMessage(chatId,"Заполните форму",{
      reply_markup:{
        keyboard:[
          [{text:'Заполните форму',web_app:{url:webAppUrl+'/form'}}]
        ]
      }
    });
  }

  if (msg?.web_app_data?.data){
    try {
      const data = await JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId,'Ваша страна:' + data?.country);
      await bot.sendMessage(chatId,'Ваша город:' + data?.city);

    } catch (error) {
      console.log(error);
    }
  }
  //bot.sendMessage(chatId, 'Received your message');
});

app.post('/web-data',async(req,res)=>{
  const {queryId, products=[], totalPrice} = req.body;
  try {
    console.log(req.body);
    await bot.answerWebAppQuery(queryId, {
      type:'article',
      id:queryId,
      title:'Успешная отправка',
      input_message_content:'Общая цена покупки' + totalPrice
    });
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({});
  }
})

const PORT = 8000;
app.listen(PORT,()=>{
  console.log(`Server has been started at port ${PORT}`);
})