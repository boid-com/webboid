export default (social)=>{
  var socialData = Object.entries(social)
  .filter(el=>el[1])
  .map((el)=>{
    let social = {}
    // social.label = el[0]
    social.url = el[1]
    if (el[0] === "telegram"){
      social.img = "/statics/social/telegramicon.png"
    }
    else if (el[0] === "discord"){
      social.img = "/statics/social/discordicon.svg"
    }
    else if (el[0] === "weChat"){
      social.img = ""
    }
    else if (el[0] === "twitter"){
      social.img = "/statics/social/twittericon.svg"
    }
    else if (el[0] === "trybe"){
      social.img = "/statics/social/trybeicon.png"
    }
    else if (el[0] === "steemit"){
      social.img = "/statics/social/steemiticon.png"
    }
    else if (el[0] === "medium"){
      social.img = "/statics/social/mediumicon.png"
    }
    else if (el[0] === "website"){
      social.img = "/statics/social/wwwicon.png"
    }
    else if (el[0] === "website2"){
      social.img = "https://i.imgur.com/Maqnjme.png"
    }
    else if (el[0] === "youtube"){
      social.img = "/statics/social/youtubeicon.png"
    }
    else if (el[0] === "reddit"){
      social.img = "/statics/social/redditicon.svg"
    }
    return social
  })
  if (socialData.length < 1) return null
  else return socialData 
}

