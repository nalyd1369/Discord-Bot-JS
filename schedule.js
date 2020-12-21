const config = require('./config.json')
var cron = require('node-cron');
var day = 'a';

var id = '756714229624602767'

city = String(arguments).replace([`"`, `'`], '');
apiKey = 'c2e5e509a45ab96fea0c8c76dc0e5c1c'
url = `https://api.openweathermap.org/data/2.5/weather?q=Dallas&units=imperial&appid=${apiKey}`

module.exports = async (client) => {
    var task = cron.schedule('0 0 14 25 * *', () =>  {
        if(client.channels.cache.get(id)){
            if (day == 'a') {
                //client.channels.cache.get(id).send(`<@&786670045283614771> Today is a A day!\nUse ${config.prefix}update to toggle updates`)
                client.channels.cache.get(id).send(`<@&786670045283614771> MERRY CHRISTMAS DIPSHITS!!!!`)
                //console.log(`@&${wantedRole}" + "\nToday is a A day!`)
                day = "b"
                return
            }
            if (day == "b") {
                //client.channels.cache.get(id).send(`<@&786670045283614771> Today is a B day!\nUse ${config.prefix}update to toggle updates`)
                client.channels.cache.get(id).send(`<@&786670045283614771> MERRY CHRISTMAS DIPSHITS!!!!`)
                //@&${wantedRole}" + 
                //console.log(`@&${wantedRole}" + "\nToday is a B day!`)
                day = "a"
                return
            }
        }

        color = client.channels.cache.get(id).me.displayHexColor

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
                client.channels.cache.get(id).send(exampleEmbed(currentTemp, maxTemp, minTemp, pressure, humidity, wind, cloudness, icon, author, profile, cityName, country));
            }).catch(err => {
                console.log(err)
                client.channels.cache.get(id).reply(`Enter a valid city name`)
            })
    }, {
        scheduled: true
    });
    
    task.start();
}