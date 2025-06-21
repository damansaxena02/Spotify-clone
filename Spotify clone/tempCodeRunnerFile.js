  let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index <as.length; index++) {
        const element =as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
        
    }
    return songs