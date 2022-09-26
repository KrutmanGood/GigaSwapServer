import { Telegraf, Markup } from 'telegraf'
import express from 'express'
import config from './config.js'

const bot = new Telegraf(config.botToken)

const app = express()
const port = 3000

app.get('/createDeal', (req, res) => {
    const firstAsset = {
        name: req.query.firstAssetName,
        count: req.query.firstAssetCount,
        price: req.query.firstAssetPrice,
    }
    const secondAsset = {
        name: req.query.secondAssetName,
        count: req.query.secondAssetCount,
        price: req.query.secondAssetPrice,
    }
    const time = getTime(req.query.time)
    const date = getDate(req.query.time)
    const type = req.query.type
    const link = req.query.link
    const hundreadCount = Math.ceil(firstAsset.price / 100)

    let message = `*GigaSwap ${firstAsset.name}/${secondAsset.name} position created!*\n`

    for (let i = 1; i <= hundreadCount; i++) {
        message = message + '👍'
    }

    message = message + `\n\nSells: ${firstAsset.count} ${firstAsset.name}(~${firstAsset.price}$) for ${secondAsset.count} ${secondAsset.name}(~${secondAsset.price}$)\nTime: ${time} on ${date}\n\n${type}`

    try {
        sendMessage(message, link)
    } catch(e) {

    }

    console.log(1)
})

app.get('/buyDeal', async (req, res) => {
    const firstAsset = {
        name: req.query.firstAssetName,
        count: req.query.firstAssetCount,
        price: req.query.firstAssetPrice,
    }

    const secondAsset = {
        name: req.query.secondAssetName,
        count: req.query.secondAssetCount,
        price: req.query.secondAssetPrice,
    }
    const time = getTime(req.query.time)
    const date = getDate(req.query.time)
    const type = req.query.type
    const link = req.query.link
    const volume = req.query.volume
    const hundreadCount = Math.ceil(firstAsset.price / 100)

    let message = `*GigaSwap OTC buy!*\n`

    for (let i = 1; i <= hundreadCount; i++) {
        message = message + '👍'
    }

    message = message + `\n\nGot: ${firstAsset.count} ${firstAsset.name} for ${secondAsset.count} ${secondAsset.name}(~${secondAsset.price})\nTime: ${time} on ${date}\nTotal Trade Volume: ~${volume}\n\n${type}`

    try {
        sendMessage(message, link)
    } catch(e) {
        console.log(e)
    }
})

bot.on('message', async ctx => {
    const lol = new Date()

    console.log(lol, ctx.update.message.chat.id)
})

bot.launch()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Функции:

function getTime(date) {
    console.log(date)

    const correctDate = new Date(date)

    console.log(correctDate)

    let hour = correctDate.getHours()

    if (hour <= 9) {
        hour = '0' + hour
    }

    let minute = correctDate.getMinutes()

    if (minute <= 9) {
        minute = '0' + minute
    }

    let second = correctDate.getSeconds()

    if (second <= 9) {
        second = '0' + second
    }

    return `${hour}:${minute}:${second}`
}

function getDate(date) {
    const correctDate = new Date(date)

    let day = correctDate.getDate()

    if (day <= 9) {
        day = '0' + day
    }

    let month = correctDate.getMonth() + 1

    if (month <= 9) {
        month = '0' + month
    }

    let year = correctDate.getFullYear()
    
    return `${day}.${month}.${year}`
}

async function sendMessage(message, link) {
    const link1 = [
        [
            Markup.button.url('Open deal', link)
        ]
    ]

    await bot.telegram.sendMessage(config.chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: link1 }
    })
}