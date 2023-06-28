import { Telegraf, Context, deunionize} from 'telegraf';
import puppeteer from 'puppeteer';
import { Product } from './product-interface';

const bot = new Telegraf("6154060382:AAEo9zD3pTvQpXerRYyiBtFx6ESjSfRzr4w");


bot.command('old', (ctx:any) => ctx.reply('Hello'));

bot.on('text',async (ctx: Context) => {

    const chatId = ctx.chat?.id
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.farmatodo.com.ve/buscar?product='+ deunionize(ctx.message)?.text);
    await page.waitForNavigation()
    const product = await page.evaluate(()=>{
      try{
        let farma: Product={
          name: "",
          price: "",
          img: '',
        }
        let product= document.querySelector("#app-component-router-outlet > div > div > app-algolia > div > div > div > app-group-view > div > div.col-12.cont-products.col-md-9 > div.cont-card-ftd.text-center")!
        console.log(product.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("src"))
        let img=product.children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[0].children[0].getAttribute("src")
        let price=product.children[0].children[0].children[0].children[1].children[1].children[1].textContent!
        let name =product.children[0].children[0].children[0].children[1].children[1].children[0].textContent!
        farma.img=`${img}`
        farma.price=price!
        farma.name=name
        return farma
      }catch(e){
        console.log(e)
      }
      })
    if(product?.img!=undefined){
      ctx.replyWithPhoto({ url: product?.img!}!,{ caption: product?.name +"\n"+ product?.price!+"\n \n"+   "💚 DISPONIBLE" })

    }else{
      ctx.reply("No Disponible")
    }
    
  });
bot.launch();