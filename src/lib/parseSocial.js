export default (social)=>{
  var socialData = Object.entries(social)
  .filter(el=>el[1])
  .map((el)=>{
    let social = {}
    // social.label = el[0]
    // social.url = el[1]
    if (el[0] === "telegram"){
      social.img = "/statics/social/telegramicon.png",
      social.url = "https://t.me/" + el[1]
    }
    else if (el[0] === "discord"){
      social.img = "/statics/social/discordicon.svg",
      social.url = "https://discord.gg/" + el[1]
    }
    else if (el[0] === "weChat"){
      social.img = ""
    }
    else if (el[0] === "twitter"){
      social.img = "/statics/social/twittericon.svg"
      social.url = "https://twitter.com/" + el[1]
    }
    else if (el[0] === "trybe"){
      social.img = "/statics/social/trybeicon.png"
      social.url = "https://trybe.one/members/"+ el[1] +"/blog/"
    }
    else if (el[0] === "steemit"){
      social.img = "/statics/social/steemiticon.png"
      social.url = "https://steemit.com/@" + el[1]
    }
    else if (el[0] === "medium"){
      social.img = "/statics/social/mediumicon.png"
      social.url = "https://medium.com/@" + el[1]
    }
    else if (el[0] === "website"){
      social.img = "/statics/social/wwwicon.png"
      social.url = "https://boid.com"
    }
    else if (el[0] === "youtube"){
      social.img = "/statics/social/youtubeicon.png"
      social.url = "https://youtube.com/channel/" + el[1]
    }
    return social
  })
  if (socialData.length < 1) return null
  else return socialData 
}

