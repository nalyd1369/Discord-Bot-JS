const Discord = require('discord.js')
const axios = require('axios')

module.exports = {
    commands: ["weather"],
    expectedArgs: '<City>',
    permissionError: "You need admin permissions to run this command",
    minArgs: 0,
    maxArgs: null,
    callback: (message, arguments, text, client) => {
        city = String(arguments).replace([`"`, `'`], '');
        apiKey = 'c2e5e509a45ab96fea0c8c76dc0e5c1c'
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
        color = message.guild.me.displayHexColor

        const exampleEmbed = (
            temp,
            maxTemp,
            minTemp,
            pressure,
            humidity,
            wind,
            cloudness,
            icon,
            author,
            profile,
            cityName,
            country
        ) =>
            new Discord.MessageEmbed()
                .setColor(`${color}`)
                .setTitle(`It is ${temp}\u00B0 F in ${cityName}, ${country}`)
                .addField(`Maximum Temperature:`, `${maxTemp}\u00B0 F`, true)
                .addField(`Minimum Temperature:`, `${minTemp}\u00B0 F`, true)
                .addField(`Humidity:`, `${humidity} %`, true)
                .addField(`Wind Speed:`, `${wind} m/s`, true)
                .addField(`Pressure:`, `${pressure} hpa`, true)
                .addField(`Cloudiness:`, `${cloudness}`, true)
                .setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)

        axios
            .get(
                url
            )
            .then(response => {
                let apiData = response;
                let currentTemp = Math.ceil(apiData.data.main.temp)
                let maxTemp = apiData.data.main.temp_max;
                let minTemp = apiData.data.main.temp_min;
                let humidity = apiData.data.main.humidity;
                let wind = apiData.data.wind.speed;
                let author = message.author.username
                let profile = message.author.displayAvatarURL
                let icon = apiData.data.weather[0].icon
                let cityName = city
                let country = apiData.data.sys.country
                let pressure = apiData.data.main.pressure;
                let cloudness = apiData.data.weather[0].description;
                message.channel.send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
            }).catch(err => {
                console.log(err)
                message.reply(`Enter a valid city name`)
            })
    }
}